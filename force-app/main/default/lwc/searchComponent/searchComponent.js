import { LightningElement , api, wire} from 'lwc';
import GETAPPOINTMENTS from "@salesforce/apex/Appointment.getAppointments";
import { publish, MessageContext } from 'lightning/messageService';
import dataChannel3 from '@salesforce/messageChannel/DataChannel3__c';
import GETPROVIDERCENTRICAPPOINTMENTS from "@salesforce/apex/Appointment.getAppointmentsForProviderCentric";

export default class SearchComponent extends LightningElement {

    @api location;
    @api dayOfTheWeek;
    @api distance;
    @api startTime;
    @api endTime;
    @api blocksOfTime;
    @api firstName;
    @api lastName;
    @api taxanomy;


    switchToProviderCentric;

    get optionsDistance(){
        return [
            { label: '1 Miles Away', value: '1 Miles Away' },
            { label: '3 Miles Away', value: '3 Miles Away' },
            { label: '5 Miles Away', value: '5 Miles Away' },
            { label: '10 Miles Away', value: '10 Miles Away' },
            { label: '15 Miles Away', value: '15 Miles Away' },
            { label: '20 Miles Away', value: '20 Miles Away' },
            { label: '25 Miles Away', value: '25 Miles Away' },
            { label: '30 Miles Away', value: '30 Miles Away' },
            { label: '40 Miles Away', value: '40 Miles Away' },
            { label: '50 Miles Away', value: '50 Miles Away' },
            { label: '75 Miles Away', value: '75 Miles Away' },
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

    handleBlocksOfTimeChange(event){
        this.blocksOfTime = event.detail.value;
    }

    handleFirstName(event) {
        this.firstName = event.detail.value;
        //console.log(this.firstName);
    }

    handleLastName(event) {
        this.lastName = event.detail.value;
        //console.log(this.lastName);
    }

    handleTaxonomy(event){
        this.taxanomy = event.detail.value;
        //console.log(this.taxanomy);
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
            this.dispatchEvent(event);
            
            const payload = { data: this.appoitments };
            publish(this.messageContext3, dataChannel3, payload);
            console.log("Payload"+payload);

        })
        .catch(error => {
            console.log(error);
            this.dispatchEvent(event);
        });
    }

    handleSubmitForProviderCentric(event){
        GETPROVIDERCENTRICAPPOINTMENTS({ 
            firstName: this.firstName,
            lastName:this.lastName,
            taxonomy : this.taxanomy,
            dayOfTheWeek: this.dayOfTheWeek,
            startTime : this.startTime,
            endTime : this.endTime, 
            distance : this.distance,
            blocksOfTime : this.blocksOfTime,
            location : this.location
        })
        .then(result => {
            this.appoitments = result;
            this.resultLength = this.appoitments.length;
            
            console.log(this.firstName+" "+this.lastName+" "+this.dayOfTheWeek+" "+this.startTime+" "+this.endTime+" "+this.distance+" "+this.location);
            console.log(this.appoitments);
            this.dispatchEvent(event);
            
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
        this.dispatchEvent(new CustomEvent('scheduleback'));
    }

    handleSwitchToProviderCentric(){
        this.switchToProviderCentric = true;
        this.appoitments = [];

        const payload = { data: this.appoitments };
        publish(this.messageContext3, dataChannel3, payload);
        console.log("Payload"+payload);
    }

    handleSwitchToPatientCentric(){
        this.switchToProviderCentric = false;
        this.appoitments = [];

        const payload = { data: this.appoitments };
        publish(this.messageContext3, dataChannel3, payload);
        console.log("Payload"+payload);
    }


}