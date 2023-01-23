/*
@description: This Lightning web component takes various input values of patient and fetches records. 
*/

import { LightningElement, api, wire, track  } from 'lwc';
import Account from '@salesforce/schema/Account';

//Importing get patient details apex method from patient apex class
import GETPATIENTRESULTS from "@salesforce/apex/Patient.getPatientDetails";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish, MessageContext } from 'lightning/messageService';

//Importing data channel for publishing searched records from patient component to patient result component
import dataChannel from '@salesforce/messageChannel/DataChannel__c';

export default class PatientComponent extends LightningElement {

    @wire(MessageContext)
    messageContext;

    objectApiName = Account;

    @api accounts = [];

    //Stores length of search results records 
    resultLength = 0;
    //Stores patient full name inside this fields
    @api accountName;
    @api firstName;
    @api lastName;
    @api phone;
    @api email;
    @api ssn;
    @api mrn;
    @api dateofBirth;

    @api country;
    @api city;
    @api street;
    @api state;
    @api zipcode;

  
    handleFirstName(event) {
        this.firstName = event.detail.value;
    }

    handleLastName(event) {
        this.lastName = event.detail.value;
    }
  
    handlePhoneChange(event) {
        this.phone = event.detail.value;
    }
  
    handleEmailChange(event) {
        this.email = event.detail.value;
    }
  
    handleSSNChange(event) {
        this.ssn = event.detail.value;
    }

    handleDateChange(event) {
        this.dateofBirth = event.detail.value;
    }
  
    handleMRNChange(event) {
        this.mrn = event.detail.value;
    }

    handleStateChange(event){
        this.state = event.detail.value;
    }

    handleCityChange(event){
        this.city = event.detail.value;
    }

    handleStreetChange(event){
        this.street = event.detail.value;
    }

    handleCountryChange(event){
        this.country = event.detail.value;
    }

    handleZipChange(event){
        this.zipcode = event.detail.value;
    }

    handleBackPage(){
        this.dispatchEvent(new CustomEvent('back'));
    }

    /*This method calls method inside patient apex class and gets the all patient records based on 
    search criteria and also publishes the data via data channel to patient result component. */

    handleSubmit(event){
        var accName;
        if(this.lastName==undefined){
            accName = this.firstName;
        }
        else{
            accName = this.firstName+" "+this.lastName;
        }
        GETPATIENTRESULTS({ 
            firstName : this.firstName,
            lastName : this.lastName,
            phone : this.phone, 
            email : this.email,
            ssn : this.ssn, 
            mrn : this.mrn,
            country : this.country, 
            state : this.state,
            city : this.city, 
            street : this.street,
            zipcode : this.zipcode,
            dateofBirth : this.dateofBirth
        })
        .then(result => {
            this.accounts = result;
            this.resultLength = this.accounts.length;
            console.log(this.dateofBirth+" "+this.ssn+" "+this.country+" "+this.city+" "+this.state+" "+this.street+" "+this.zipcode);

            this.dispatchEvent(event);

            //Publishing patient records to patient result component
            const payload = { data: this.accounts };
            publish(this.messageContext, dataChannel, payload);
            console.log("Payload"+payload);
        })
        .catch(error => {
            console.log(error);
            this.dispatchEvent(event);
        });
        this.accountName = this.firstName+" "+this.lastName;

    }



} 