import { LightningElement, api, wire, track } from 'lwc';

import { publish } from 'lightning/messageService';

import FIRSTNAME from '@salesforce/schema/Appointment__c.First_Name__c';
import LASTNAME from '@salesforce/schema/Appointment__c.Last_Name__c';
import FIRSTAVAILABLE from '@salesforce/schema/Appointment__c.First_Available__c';
import STARTTIME from '@salesforce/schema/Appointment__c.Appointment_Start_Time__c';
import ENDTIME from '@salesforce/schema/Appointment__c.Appointment_End_Time__c';
import LOCATION from '@salesforce/schema/Appointment__c.Location__c';
import DISTANCE from '@salesforce/schema/Appointment__c.Distance__c';
import DAYOFWEEK from '@salesforce/schema/Appointment__c.Days_of_the_week__c';
import APPOINTMENTDATE from '@salesforce/schema/Appointment__c.Appointment_Date__c';

import dataChannel3 from '@salesforce/messageChannel/DataChannel3__c';
import dataChannel from '@salesforce/messageChannel/DataChannel__c';

import {
    subscribe,
    unsubscribe,
    MessageContext
} from 'lightning/messageService';

const COLS = [

    {
        label: 'First Name',
        fieldName: FIRSTNAME.fieldApiName,
        editable: true
    },
    {
        label: 'Last Name',
        fieldName: LASTNAME.fieldApiName,
        editable: true
    },
    {
        label: 'First Available',
        fieldName: FIRSTAVAILABLE.fieldApiName,
        editable: true
    },
    { 
        label: 'Day of the Week', 
        fieldName: DAYOFWEEK.fieldApiName, 
        editable: true 
    },
    { 
        label: 'Start Time', 
        fieldName: STARTTIME.fieldApiName, 
        type: 'date', 
        typeAttributes: {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          },
        editable: true 
    },
    { 
        label: 'End Time', 
        fieldName: ENDTIME.fieldApiName, 
        type: 'date', 
        typeAttributes: {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          },
        editable: true  
    },
    { 
        label: 'Location', 
        fieldName: LOCATION.fieldApiName, 
        editable: true 
    },
    { 
        label: 'Distance', 
        fieldName: DISTANCE.fieldApiName, 
        editable: true 
    }
];

export default class SearchResult extends LightningElement {
 
    @api recordId;

    chooseTimeSlot = true;

    @wire(MessageContext)
    messageContext3;

    @wire(MessageContext)
    messageContext;

    isShowModal = false;

    scheduleData = [];

    resultLength = 0;
    columns = COLS;
    subscription = null;
    subscription1 = null;
    showResult = true;s

    @api patientrecord;
    @track patientDisplay = [];

    connectedCallback() {
        console.log('Patient');
        console.log(JSON.parse(JSON.stringify(this.patientrecord)));
        this.patientDisplay = JSON.parse(JSON.stringify(this.patientrecord));
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext3,
                dataChannel3,
                (message) => this.handleMessage(message)
            );

        }
    }
    
    handleMessage(message) {
        this.scheduleData = message.data;
        this.resultLength = this.scheduleData.length;
        console.log("Schedule data : "+this.scheduleData);
    }

    handleRowSelection = event => {
        const  selectedRows = event.detail.selectedRows;
        console.log(selectedRows);
        this.scheduleDT = JSON.parse(JSON.stringify(selectedRows));
        console.log(JSON.parse(JSON.stringify(selectedRows)));
        console.log(this.scheduleDT);
        console.log('Patient');
        if(this.scheduleDT.length>0){
            this.chooseTimeSlot = false;
        }
   }

    handleSubmit(event){
        if(this.scheduleDT.length>0){
            const selectedEvent = new CustomEvent('schedulechoosed', { detail: this.scheduleDT });
            this.dispatchEvent(selectedEvent);
        }
    }

   handlePublish(){
        this.isShowModal = true;
   }

   hideModalBox(){
        this.isShowModal = false;
    }

}