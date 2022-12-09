import { LightningElement, api, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import dataChannel2 from '@salesforce/messageChannel/DataChannel2__c';
import GETPROVIDERS from "@salesforce/apex/Provider.getProviders";

export default class ProviderComponent extends LightningElement {

    valueGender = 'Select gender';
    valueInNetwork = 'Select In-Network';
    valueSpeciality = 'Select Speciality';
    valueDistance = 'Select Distance';

    @api speciality;

    @api firstName;
    @api lastName;
    @api gender;
    @api startTime;
    @api endTime;
    @api inNetwork;
    @api taxanomy;
    @api location;
    @api distance;

    handleFirstName(event) {
        this.firstName = event.detail.value;
        //console.log(this.firstName);
    }

    handleLastName(event) {
        this.lastName = event.detail.value;
        //console.log(this.lastName);
    }

    handleGenderChange(event) {
        this.gender = event.detail.value;
        //console.log(this.gender);
    }

    handleInNetworkChange(event){
        this.inNetwork = event.detail.value;
        //console.log(this.inNetwork);
    }

    handleStartTime(event){
        this.startTime = event.detail.value;
       // console.log(this.startTime);
    }

    handleEndTime(event){
        this.endTime = event.detail.value;
        //console.log(this.endTime);
    }

    handleSpecialityChange(event){
        //console.log(event.detail.value);
        this.speciality = event.detail.value;
        //JSON.parse(JSON.stringify(event.detail.value));
        //console.log(this.selectedSpecialities);
    }

    handleTaxonomy(event){
        this.taxanomy = event.detail.value;
        //console.log(this.taxanomy);
    }

    handleLocation(event){
        this.location = event.detail.value;
        //console.log(this.location);
    }

    handleDistanceChange(event){
        this.distance = event.detail.value;
        //console.log(this.distance);
    }

    get optionsGender() {
        return [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
        ];
    }

    get optionsInNetwork(){
        return [
            { label: 'In-Network', value: 'In-Network' },
            { label: 'Out-of-Network', value: 'Out-of-Network' },
        ];
    }

    get optionsDistance(){
        return [
            { label: '10 Miles Away', value: '10 Miles Away' },
            { label: '25 Miles Away', value: '25 Miles Away' },
            { label: '50 Miles Away', value: '50 Miles Away' },
            { label: '100 Miles Away', value: '100 Miles Away' },
        ];
    }
    
    get optionsSpeciality(){
        return [
            { label: 'Internal medicine', value: 'Internal medicine' },
            { label: 'Anesthesiology', value: 'Anesthesiology' },
            { label: 'Neurology', value: 'Neurology' },
            { label: 'Orthopedics', value: 'Orthopedics' },
            { label: 'Psychiatry', value: 'Psychiatry' },
            { label: 'Pediatrics', value: 'Pediatrics' },
            { label: 'Dermatology', value: 'Dermatology' },
            { label: 'Family medicine', value: 'Family medicine' },
            { label: 'Radology', value: 'Radology' },
            { label: 'Pathaology', value: 'Pathaology' },
            { label: 'General Surgery', value: 'General Surgery' },
            { label: 'Oncology', value: 'Oncology' },
            { label: 'Urology', value: 'Urology' },
            { label: 'Nuclear medicine', value: 'Nuclear medicine' },
            { label: 'Cardiology', value: 'Cardiology' },
            { label: 'Orthopedics', value: 'Orthopedics' },
            { label: 'Plastic surgery', value: 'Plastic surgery' },
            { label: 'Neurosurgeon', value: 'Neurosurgeon' },
            { label: 'Hematology', value: 'Hematology' },
            { label: 'Endocrinology', value: 'Endocrinology' },
            { label: 'Gerialtrics', value: 'Gerialtrics' },
            { label: 'Vascular surgery', value: 'Vascular surgery' },
            { label: 'Gynaecology', value: 'Gynaecology' },
            { label: 'Neonatology', value: 'Neonatology' },
            { label: 'Neurology', value: 'Neurology' },
            { label: 'Pain management', value: 'Pain management' },
        ];
    }


    @wire(MessageContext)
    messageContext2;

    providers = [];

    handleSubmit(event){
        var providerName;
        if(this.lastName==undefined){
            providerName = this.firstName;
        }
        else{
            providerName = this.firstName+" "+this.lastName;
        }
        GETPROVIDERS({ 
            name: providerName,
            gender : this.gender, 
            inNetwork : this.inNetwork,
            taxonomy : this.taxanomy, 
            startTime : this.startTime,
            endTime : this.endTime, 
            distance : this.distance,
            specialities : this.selectedSpecialities, 
            location : this.location
        })
        .then(result => {
            this.providers = result;
            this.resultLength = this.providers.length;
            
            console.log(providerName+" "+this.gender+" "+this.inNetwork+" "+this.taxanomy+" "+this.startTime+" "+this.endTime+" "+this.distance+this.location);
            console.log(this.selectedSpecialities);
            console.log(this.providers);

            this.dispatchEvent(event);

            const payload = { data: this.providers };
            publish(this.messageContext2, dataChannel2, payload);
            console.log("Payload"+payload);
        })
        .catch(error => {
            console.log(error);
            this.dispatchEvent(event);
        });


    }

}