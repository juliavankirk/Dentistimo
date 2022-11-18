const express = require('express')
const router = express.Router()
const axios = require('axios')
const registry = require('../registry/registry.json')
const fs = require('fs')
const loadBalancer = require('../balancer/loadbalancer')
const gatewayConfig = require('../gateway.config')

router.post('/enable/:serviceName', (req, res) => {
    const serviceName = req.params.serviceName
    const requestBody = req.body
    const instances = registry.services[serviceName].instances
    const index = instances.findIndex((srv) => { return srv.url === requestBody.url })
    if(index === -1){
        res.send({ status: 'error', message: "Could not find '" + requestBody.url + "' for service '" + serviceName + "'"})
    } else {
        instances[index].enabled = requestBody.enabled
        fs.writeFile(gatewayConfig.REGISTRY_PATH, JSON.stringify(registry), (error) => {
            if (error) {
                res.send("Could not enable/disable '" + requestBody.url + "' for service '" + serviceName + ":'\n" + error)
            } else {
                res.send("Successfully enabled/disabled '" + requestBody.url + "' for service '" + serviceName + "'\n")
            }
        })
    }
})

router.all('/:serviceName/:path', (req, res) => {
    const service = registry.services[req.params.serviceName]
    console.log('Routing for: ' + req.params.serviceName + ' ' + req.params.path)
    if (service) {
        if (!service.loadBalancerStrategy) {
            service.loadBalancerStrategy = 'ROUND_ROBIN'
            fs.writeFile(gatewayConfig.REGISTRY_PATH, JSON.stringify(registry), (error) => {
                if (error) {
                    res.send("Couldn't write load balance strategy" + error)
                }
            })
        }

        const newIndex = loadBalancer[service.loadBalancerStrategy](service)
        const url = service.instances[newIndex].url
        console.log(url)
        const config = { headers: req.headers };

        if (req.method === 'GET') {
            axios.get(
                url + req.params.path,
                {
                    headers: req.headers
                }
            ).then((response) => {
                res.send(response.data)
            }).catch(error => {
                res.send("")
            })
        } else if (req.method === 'POST') {
            axios.post(
                url + req.params.path,
                {
                        data: req.body},
                {
                    headers: req.headers,
                    params: req.params
                }
            ).then((response) => {
                res.send(response.data)
            }).catch(error => {
                res.send("")
            })
        } else if (req.method === 'PUT') {
            axios.put(
                url + req.params.path,
                { data: req.body },
                {
                    headers: req.headers
                }
            ).then((response) => {
                res.send(response.data)
            }).catch(error => {
                res.send("")
            })
        } else if (req.method === 'DELETE') {
            axios.delete(
                url + req.params.path,
                {
                    data: req.body
                },
                { headers: req.headers }
            ).then((response) => {
                res.send(response.data)
            }).catch(error => {
                res.send("")
            })
        }
    } else {
        res.send("API Name doesn't exist")
    }
})

router.post('/register', (req, res) => {
    const registrationInfo = req.body
    registrationInfo.url = registrationInfo.protocol + "://" + registrationInfo.host + ":" + registrationInfo.port + "/"

    if (serviceAlreadyExists(registrationInfo)) {
        res.send("Configuration already exists for '" + registrationInfo.serviceName + "' at '" + registrationInfo.url + "'")
    } else {
        registry.services[registrationInfo.serviceName].instances.push({ ...registrationInfo })
        fs.writeFile(gatewayConfig.REGISTRY_PATH, JSON.stringify(registry), (error) => {
            if (error) {
                res.send("Could not register '" + registrationInfo.serviceName + "'\n" + error)
            } else {
                res.send("Successfully registered '" + registrationInfo.serviceName + "'")
            }
        })
    }
})

router.post('/unregister', (req, res) => {
    const registrationInfo = req.body

    if (serviceAlreadyExists(registrationInfo)) {
        const index = registry.services[registrationInfo.serviceName].instances.findIndex((instance) => {
            return registrationInfo.url === instance.url
        })
        registry.services[registrationInfo.serviceName].instances.splice(index, 1)
        fs.writeFile(gatewayConfig.REGISTRY_PATH, JSON.stringify(registry), (error) => {
            if (error) {
                res.send("Could not unregister '" + registrationInfo.serviceName + "'\n" + error);
            } else {
                res.send("Successfully unregistered '" + registrationInfo.serviceName + "'");
            }
        })
    } else {
        res.send("Configuration does not exist for '" + registrationInfo.serviceName + "' at '" + registrationInfo.url + "'");
    }
})

const serviceAlreadyExists = (registrationInfo) => {
    let serviceExists = false;
    registry.services[registrationInfo.serviceName].instances.forEach(instance => {
        if (instance.url === registrationInfo.url) {
            serviceExists = true;
            return;
        }
    })
    return serviceExists;
}

module.exports = router
