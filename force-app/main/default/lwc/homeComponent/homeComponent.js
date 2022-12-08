import { LightningElement, api } from 'lwc';
import PATIENT from '@salesforce/resourceUrl/HealthPatient';
import PROVIDER from '@salesforce/resourceUrl/HealthProvider';
import SCHEDULE from '@salesforce/resourceUrl/HealthSchedule';
import DOCTOR from '@salesforce/resourceUrl/HealthDoctor';

export default class HealthComponents extends LightningElement {

    @api isHomePage;
    healthPatient = PATIENT;
    healthProvider = PROVIDER;
    healthSchedule = SCHEDULE;
    healthDoctor = DOCTOR;
    
    showRecord = false;
    showPatientHome = true;
    patientData = [];

    constructor() {
        super();   
        this.isHomePage = true;
        //this.template.addEventListener('choosed', this.handleChoosed.bind(this));
    }

    handleClick(){
        this.isHomePage = false;
    }
    handleChoosed(event){
        console.log(JSON.parse(JSON.stringify(event.detail)));
        this.patientData = event.detail;
        console.log('This is running!');
        this.isHomePage = true;
        this.showPatientHome = false;
        this.showRecord = true;

        console.log(this.showPatientHome+" "+this.showRecord);
    }

    handleChange(){
        this.isHomePage = false;
    }
    
}