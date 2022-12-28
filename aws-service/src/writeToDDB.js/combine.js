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
    documentClient.get(params, async function(err, data){
        console.log("inside parent func");
        let dentists = await numOfDentist(event);
        console.log(dentists);
        if(data.Item == null) {
            console.log("new item created");
            addNewBooking(event, context, callback);       
            callback(err, null);     
        }  else if (data.Item) {  
        callback(null, data);
        console.log("added to array");
        console.log(data)
        //dentists = numOfDentist(event, context, callback)
        //console.log(dentists)
        console.log(JSON.stringify(data))
        //let record = JSON.parse(data);
        } 
    }) 
}

const addNewBooking = function(event, context, callback) {     
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

const numOfDentist = async function(event) {
    
    let num = -1;
    let params = {         
        TableName : "DentistimoClinicsTable",         
        Key: {             
            "id": parseInt(event.ClinicId)         
        } 
    }  
    const myResolve = (myParam) => {
        num = myParam;
    }
    const myReject = (myParam) => {
        console.log(myParam);
    }

    await documentClient.get(params)
        .promise()
        .then((data) => {     
            num = -3;
            let number = data.Item.dentists;
            console.log("inside numOfDentist");
            console.log(number);
            myResolve(number);
        }).catch((err) => {
            console.log(err);
            myReject(err);
        });
    // invoking promise obj my calling then to trigger lambda to get val from db
    // then calls res/rej funcs, which trigger handlers depending on res or rej
    return num;
}
/*
const updateBooking = function(event, context, callback) {
    let params = {
        data.Items.forEach(function(item) {
            for (var attributename in item) {
                if (item[attributename] === null) {
                    UpdateNullFieldsToEmpty(item.PK, item.SK, attributename);
            }
        }
    }
} */