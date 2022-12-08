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
    
    showPatientRecord = false;
    showPatientHome = true;
    showPatientComponent = false;
    patientData = [];
    showProvider = false;

    showProviderComponent = false;

    constructor() {
        super();   
        this.isHomePage = true;
        //this.template.addEventListener('choosed', this.handleChoosed.bind(this));
    }

    handleClickPatient(){
        this.isHomePage = false;
        this.showPatientComponent = true;
    }
    handleChoosed(event){
        console.log(JSON.parse(JSON.stringify(event.detail)));
        this.patientData = event.detail;
        console.log('This is running!');
        this.isHomePage = true;
        this.showPatientHome = false;
        this.showPatientComponent = false;
        this.showPatientRecord = true;

        console.log(this.showPatientHome+" "+this.showPatientRecord);
    }

    handlePatientChange(){
        this.isHomePage = false;
        this.showPatientComponent = true;
    }

    handleClickProvider(){
        this.isHomePage = false;
        this.showPatientComponent = false;
        this.showProviderComponent = true;
    }

    handleClickSchedule(){

    }
    
}