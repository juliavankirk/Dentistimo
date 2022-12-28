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
            callback(err, null);     
        }     
        callback(null, data);  
    }) 
}