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

import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import FullCalendarJS from '@salesforce/resourceUrl/FullCalendarJS';
import getOppo from '@salesforce/apex/oppoCloseDate.getOppo';

import secondtemplate from './searchResult.html';

import {
    subscribe,
    unsubscribe,
    MessageContext
} from 'lightning/messageService';
import MailingPostalCode from '@salesforce/schema/Contact.MailingPostalCode';

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

    listView = true;
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
    showResult = true;

    alreadyRendered = false;

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
    rerender;
    handleMessage(message) {
        this.scheduleData = message.data;
        this.resultLength = this.scheduleData.length;
        console.log("Schedule data : "+this.scheduleData);
        this.returnedOppo = this.scheduleData;
        this.renderFullCalender();
        this.alreadyRendered = true; 
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
        this.getTasks();
    }

   handlePublish(){
        this.isShowModal = true;
   }

   hideModalBox(){
        this.isShowModal = false;
    }
//Calendar view logic starts

    handleCalendarView(){
        this.listView = false;
        if(this.alreadyRendered){
            this.initialiseFullCalendarJs();
            this.renderFullCalender();
        }
        else{
            this.initialiseFullCalendarJs();
        }
        //this.renderFullCalender();
        

    }

    handleListView(){
        this.listView = true;
        this.initialiseFullCalendarJs();
        this.renderFullCalender();
    }

    stopRendering = false;

    @track returnedOppo = [] ;
    @track finalOppo = [] ;

    appMap = new Map();

    renderFullCalender(){
        Promise.all([
            loadScript(this, FullCalendarJS + '/jquery.min.js'),
            loadScript(this, FullCalendarJS + '/moment.min.js'),
            loadScript(this, FullCalendarJS + '/fullcalendar.min.js'),
            loadStyle(this, FullCalendarJS + '/fullcalendar.min.css'),
        ])
        .then(() => {
            this.getTasks();
            
        })
        .catch(error => {
            console.error({
            message: 'Error occured on FullCalendarJS',
            error
            });
        })
    }

    //renderedCallback() {

    //}

    initialiseFullCalendarJs() {

      console.log(this.returnedOppo.length);
      var str = window.location.href;
      var pos = str.indexOf(".com/");
      var last = pos + 4;
      var tDomain = str.slice(0,last);
      this.finalOppo = [] ;
      for(var i = 0 ; i < this.returnedOppo.length ; i++)
      {
        var startDate = new Date(this.returnedOppo[i].Appointment_Start_Time__c);

        startDate.setHours(startDate.getHours() + 10)
        startDate.setMinutes(startDate.getMinutes() + 30)


        var hours = startDate.getHours();
        var minutes = startDate.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;

        var endDate = new Date(this.returnedOppo[i].Appointment_End_Time__c);

        endDate.setHours(endDate.getHours() + 10)
        endDate.setMinutes(endDate.getMinutes() + 30)


        var hours1 = endDate.getHours();
        var minutes1 = endDate.getMinutes();
        var ampm1 = hours1 >= 12 ? 'pm' : 'am';
        hours1 = hours1 % 12;
        hours1 = hours1 ? hours1 : 12; 
        minutes1 = minutes1 < 10 ? '0'+minutes1 : minutes1;
        var endTime = hours1 + ':' + minutes1 + ' ' + ampm1;

            this.finalOppo.push({
                start : this.returnedOppo[i].Appointment_Start_Time__c,
                title : ' '+strTime+' to '+endTime, 
                url : tDomain+'/lightning/r/Appointment__c/'+this.returnedOppo[i].Id+'/view'
            });
      } 
      console.log(this.finalOppo.length);
      console.log('Final Task Length Above');
      const ele = this.template.querySelector('div.fullcalendarjs');
      $(ele).fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay'
        },
        defaultDate: new Date(), // default day is today
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        displayEventTime: false, 
        eventLimit: true, // allow "more" link when too many events
        events : this.finalOppo
      });
    }
    getTasks(){
        console.log('Calender');
        console.log(this.scheduleData)
        this.returnedOppo = this.scheduleData;
        this.initialiseFullCalendarJs();
    }

    render(){
        console.log('Inside render');
        return secondtemplate;
    }

}
  