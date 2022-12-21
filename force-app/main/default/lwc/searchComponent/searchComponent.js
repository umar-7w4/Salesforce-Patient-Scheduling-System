import { LightningElement , api, wire} from 'lwc';
import GETAPPOINTMENTS from "@salesforce/apex/Appointment.getAppointments";
import { publish, MessageContext } from 'lightning/messageService';
import dataChannel3 from '@salesforce/messageChannel/DataChannel3__c';

export default class SearchComponent extends LightningElement {

    @api location;
    @api dayOfTheWeek;
    @api distance;
    @api startTime;
    @api endTime;

    get optionsDistance(){
        return [
            { label: '10 Miles Away', value: '10 Miles Away' },
            { label: '25 Miles Away', value: '25 Miles Away' },
            { label: '50 Miles Away', value: '50 Miles Away' },
            { label: '100 Miles Away', value: '100 Miles Away' },
        ];
    }

    appoitments = [];

    @wire(MessageContext)
    messageContext3;

    handleLocation(event){
        this.location = event.detail.value;
       // console.log(this.location);
    }

    handleDayOfTheWeek(event){
        this.dayOfTheWeek = event.detail.value;
        //console.log(this.dayOfTheWeek);
    }

    handleDistanceChange(event){
        this.distance = event.detail.value;
        //console.log(this.distance);
    }

    handleStartTime(event){
        this.startTime = event.detail.value;
        //console.log(this.startTime);
    }

    handleEndTime(event){
        this.endTime = event.detail.value;
        //console.log(this.endTime);
    }

    handleSubmit(event){
        GETAPPOINTMENTS({ 
            dayOfTheWeek: this.dayOfTheWeek,
            startTime : this.startTime,
            endTime : this.endTime, 
            distance : this.distance,
            location : this.location
        })
        .then(result => {
            this.appoitments = result;
            this.resultLength = this.appoitments.length;
            
            console.log(this.dayOfTheWeek+" "+this.startTime+" "+this.endTime+" "+this.distance+" "+this.location);
            console.log(this.appoitments);

            const payload = { data: this.appoitments };
            publish(this.messageContext3, dataChannel3, payload);
            console.log("Payload"+payload);

        })
        .catch(error => {
            console.log(error);
            this.dispatchEvent(event);
        });


    }

    handleBackPage(){
        this.dispatchEvent(new CustomEvent('backagain'));
    }


}