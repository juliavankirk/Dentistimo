<p align="center"><img src="public/images/toothie-1.png?raw=true" alt="toothie-logo.png" width="120"></p>

Appointment management system for Dental offices booking and its management 

- [Introduction](#introduction)
- [How to use](#how-to-use)
- [Dependencies](#dependencies)
- [License](#license)

## Introduction
In this repository you can find all the necessary information to use API Gateway for Team-12.

Furthermore, you have access to all source codes and files that we put our effort to build this project. If you find any
bugs, mistakes, foolishness, typos or have useful suggestions, please contact us (how? ... let's see about that) as we
appreciate your interest in our project.

## How to use

### Register your microservice
Will be updated soon with instructions ...

### Unregister your microservice

Upon gracefully stopping your Docker container, the following CURL command must be issued during stop process.
Substitute proper service hostname, port and gateway hostname for container setup.

```curl -X POST -d '{"serviceName": "YOUR_MICROSERVICE_NAME", "url": "http://SERVICE_HOSTNAME:PORT/"}' http://API_GATEWAY_HOSTNAME:3030/unregister -H "Content-Type: application/json"```

For testing from Windows, you will need the following format for double quotes escaping:

```curl -d "{\"serviceName\": \"YOUR_MICROSERVICE_NAME\", \"url\": \"http://SERVICE_HOSTNAME:PORT/\"}" -X POST http://API_GATEWAY_HOSTNAME:3030/unregister -H "Content-Type: application/json"```


## Dependencies
Will be updated soon with dependencies ...

## License
MIT © Team-12 for DIT356
The source code for the site is licensed under the MIT license, which you can find in the MIT-LICENSE.txt file.

All graphical assets are licensed under the [Creative Commons Attribution 3.0 Unported License](https://creativecommons.org/licenses/by/3.0/).
