import { LightningElement, wire, api, track } from 'lwc';

import getAccounts from '@salesforce/apex/Patient.getPatientDetails';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish } from 'lightning/messageService';
import CREATEACCOUNT from "@salesforce/apex/Patient.createPatient";

import NAME from '@salesforce/schema/Account.Name';
import LASTNAME_FIELD from '@salesforce/schema/Account.LastName';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import EMAIL_FIELD from '@salesforce/schema/Account.Email__c';
import SSN_FIELD from '@salesforce/schema/Account.SSN__c';
import MRN_FIELD from '@salesforce/schema/Account.MRN__c';
import COUNTRY from '@salesforce/schema/Account.BillingCountry';
import STATE from '@salesforce/schema/Account.BillingState';
import CITY from '@salesforce/schema/Account.BillingCity';
import STREET from '@salesforce/schema/Account.BillingStreet';
import ZIPCODE from '@salesforce/schema/Account.BillingPostalCode';
import BIRTHDAY from '@salesforce/schema/Account.Birth_Date__c';

import ID_FIELD from '@salesforce/schema/Account.Id';
import dataChannel from '@salesforce/messageChannel/DataChannel__c';
import {
    subscribe,
    unsubscribe,
    MessageContext
} from 'lightning/messageService';

const COLS = [

    {
        label: 'Name',
        fieldName: NAME.fieldApiName,
        editable: true
    },
    {
        label: 'Phone',
        fieldName: PHONE_FIELD.fieldApiName,
        type: 'phone',
        editable: true
    },
    {
        label: 'Email',
        fieldName: EMAIL_FIELD.fieldApiName,
        type: 'email',
        editable: true
    },
    { 
        label: 'SSN', 
        fieldName: SSN_FIELD.fieldApiName, 
        editable: true 
    },
    { 
        label: 'MRN', 
        fieldName: MRN_FIELD.fieldApiName, 
        editable: true 
    },
    { 
        label: 'Birthday', 
        fieldName: BIRTHDAY.fieldApiName, 
        editable: true 
    },
    { 
        label: 'Country', 
        fieldName: COUNTRY.fieldApiName, 
        editable: true 
    },
    { 
        label: 'State', 
        fieldName: STATE.fieldApiName, 
        editable: true 
    },
    { 
        label: 'City', 
        fieldName: CITY.fieldApiName, 
        editable: true 
    },
    { 
        label: 'Street', 
        fieldName: STREET.fieldApiName, 
        editable: true 
    },
    { 
        label: 'Zipcode', 
        fieldName: ZIPCODE.fieldApiName, 
        editable: true 
    }
];

export default class PatientResult extends LightningElement {

    @api recordId;

    @wire(MessageContext)
    messageContext;

    @wire(MessageContext)
    messageContext2;

    resultLength = 0;
    accountData = [];
    patientsDT = [];
    columns = COLS;
    subscription = null;
    isShowModal = false;
    showResult = true;

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
        CREATEACCOUNT({ 
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
            console.log('Result');
            console.log(result);
            this.patientsDT.push(result);

            const selectedEvent = new CustomEvent('choosed', { detail: this.patientsDT });
            this.dispatchEvent(selectedEvent);
        })
        .catch(error => {
            console.log(error);
            const event = new ShowToastEvent({
                title : 'Error',
                message : 'Enter Patient details properly!',
                variant : 'error'
            });
            this.dispatchEvent(event);
        });
        this.accountName = this.firstName+" "+this.lastName;

    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                dataChannel,
                (message) => this.handleMessage(message)
            );
        }
    }
    
    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }
    
    handleMessage(message) {
        this.accountData = message.data;
        this.resultLength = this.accountData.length;
        console.log("Data R : "+this.accountData);
        //this.unsubscribeToMessageChannel();
    }

    handleRowSelection = event => {
        const  selectedRows = event.detail.selectedRows;
        console.log(selectedRows);
        this.patientsDT = JSON.parse(JSON.stringify(selectedRows));
        console.log(JSON.parse(JSON.stringify(selectedRows)));
        console.log(this.patientsDT);
   }

    handlePublish(){
        if(this.patientsDT.length>0){
            const payload = { data: this.patientsDT };
            publish(this.messageContext, dataChannel, payload);
            console.log('payload');
            console.log(payload);

            const selectedEvent = new CustomEvent('choosed', { detail: this.patientsDT });
            this.dispatchEvent(selectedEvent);
        }
    }

    handleModal(){
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }

}