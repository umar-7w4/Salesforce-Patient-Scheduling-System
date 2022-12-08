import { LightningElement, api, wire, track  } from 'lwc';
import Account from '@salesforce/schema/Account';
import Apex_Method_One_Ref from "@salesforce/apex/Patient.getPatientDetails";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish, MessageContext } from 'lightning/messageService';
import dataChannel from '@salesforce/messageChannel/DataChannel__c';

export default class PatientComponent extends LightningElement {

    @wire(MessageContext)
    messageContext;

    objectApiName = Account;

    @api accounts = [];

    resultLength = 0;
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

    handleSubmit(event){
        var accName;
        if(this.lastName==undefined){
            accName = this.firstName;
        }
        else{
            accName = this.firstName+" "+this.lastName;
        }
        Apex_Method_One_Ref({ 
            name : accName,
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
            //console.log(this.accounts);
            console.log(this.dateofBirth+" "+this.ssn+" "+this.country+" "+this.city+" "+this.state+" "+this.street+" "+this.zipcode);

            this.dispatchEvent(event);

            const payload = { data: this.accounts };
            publish(this.messageContext, dataChannel, payload);
            console.log("Payload"+payload);
        })
        .catch(error => {
            console.log(error);
            this.dispatchEvent(event);
        });
        this.accountName = this.firstName+" "+this.lastName;
        //console.log(this.firstName+" "+this.lastName+" "+this.phone+" "+this.email+" "+this.ssn+" "+this.mrn+this.accountName);


    }



} 