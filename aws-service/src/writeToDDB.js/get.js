'use strict'  
const AWS = require('aws-sdk'); 
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'eu-central-1'});  
exports.handler = function(event, context, callback) {     
    let params = {         
        TableName : "DentistimoBookings",         
        Key: {             
            "ClinicId": event.ClinicId,             
            "Date": event.Date,                    
        } 
    }  
    documentClient.get(params, function(err, data){          
        if(err) {  
            //write();       
            callback(err, null);     
        }     
        callback(null, data);
        let record = JSON.parse(data);  
    }) 
}

const write = function(event, context, callback) {     
    let params = {         
        TableName : "DentistimoBookings",         
        Item: {             
            "ClinicId": event.ClinicId,             
            "Date": event.Date,
            "TimeSlots": [{
                "Time": event.Time,
                "Email": [{
                    "S": event.Email
                }]
            }]                    
        } 
    }  
    documentClient.put(params, function(err, data){          
        if(err) {         
            callback(err, null);
        }     
        callback(null, data);  
    }) 
}