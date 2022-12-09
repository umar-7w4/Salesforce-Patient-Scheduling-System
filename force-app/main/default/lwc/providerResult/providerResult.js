import { LightningElement, api , wire} from 'lwc';

import getAccounts from '@salesforce/apex/Patient.getPatientDetails';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish } from 'lightning/messageService';

import NAME from '@salesforce/schema/Provider__c.Provider_Name__c';
import DISTANCE from '@salesforce/schema/Provider__c.Distance__c';
import ENDTIME from '@salesforce/schema/Provider__c.End_Time__c';
import GENDER from '@salesforce/schema/Provider__c.Gender__c';
import INNETWORK from '@salesforce/schema/Provider__c.In_Network__c';
import LOCATION from '@salesforce/schema/Provider__c.Location__c';
import SPECIALITY from '@salesforce/schema/Provider__c.Speciality__c';
import STARTTIME from '@salesforce/schema/Provider__c.Start_Time__c';
import TAXONOMY from '@salesforce/schema/Provider__c.Taxonomy__c';

import dataChannel from '@salesforce/messageChannel/DataChannel__c';
import {
    subscribe,
    unsubscribe,
    MessageContext
} from 'lightning/messageService';

const COLS = [

    {
        label: 'Provider Name',
        fieldName: NAME.fieldApiName,
        editable: true
    },
    {
        label: 'Gender',
        fieldName: GENDER.fieldApiName,
        editable: true
    },
    { 
        label: 'In Network', 
        fieldName: INNETWORK.fieldApiName, 
        editable: true 
    },
    {
        label: 'Speciality',
        fieldName: SPECIALITY.fieldApiName,
        editable: true
    },
    { 
        label: 'Taxonomy', 
        fieldName: TAXONOMY.fieldApiName, 
        editable: true 
    },
    { 
        label: 'Start Time', 
        fieldName: STARTTIME.fieldApiName, 
        editable: true 
    },
    { 
        label: 'End Time', 
        fieldName: ENDTIME.fieldApiName, 
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

export default class ProviderResult extends LightningElement {

    @api recordId;

    @wire(MessageContext)
    messageContext;

    providersData = [];

    resultLength = 0;
    columns = COLS;
    subscription = null;
    showResult = true;


}