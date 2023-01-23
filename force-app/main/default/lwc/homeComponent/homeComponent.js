/*
@description: This Lightning web component is a home component for patient, provider, and scheduling. 
              This component also displayed choosed record for the patient, provider, and scheduling
*/

import { LightningElement, api } from 'lwc';
import PATIENT from '@salesforce/resourceUrl/HealthPatient';
import PROVIDER from '@salesforce/resourceUrl/HealthProvider';
import SCHEDULE from '@salesforce/resourceUrl/HealthSchedule';
import DOCTOR from '@salesforce/resourceUrl/HealthDoctor';

export default class HealthComponents extends LightningElement {

    @api isHomePage;

    //Logo for patient home component
    healthPatient = PATIENT;
    //Logo for provider home component
    healthProvider = PROVIDER;
    //Logo for schedule home component
    healthSchedule = SCHEDULE;
    //Logo for provider home component
    healthDoctor = DOCTOR;

    //Provider and schedule boolean values to disable and enable them conditionally 
    providerButton = true;
    scheduleButton = true;

    //Stores choosed patient data that will be displaced on home component 
    @api patientData = [];
    //Stores choosed provider data that will be displaced on home component 
    providerData = [];
    
    //Boolean values to display patient search component and choosed records conditionally 
    showPatientRecord = false;
    showPatientHome = true;
    showPatientComponent = false;

    //Boolean values to display provider search component and choosed records conditionally 
    showProviderHome = true;
    showProviderRecord = false;
    showProviderComponent = false;

    //Boolean values to display schedule search component and choosed records conditionally 
    showScheduleHome = true;
    showScheduleRecord = false;
    showScheduleComponent = false;

    schedleData = [];

    constructor() {
        super();   
        this.isHomePage = true;
    }

    //Displays patient component on clicking fet started button
    handleClickPatient(){
        this.isHomePage = false;
        this.showPatientComponent = true;
    }
    //Displays choosed patient value on the home page
    handleChoosed(event){
        console.log(JSON.parse(JSON.stringify(event.detail)));
        this.patientData = event.detail;
        console.log('This is running!');
        this.isHomePage = true;
        this.providerButton = false;
        this.showPatientHome = false;
        this.showPatientComponent = false;
        this.showPatientRecord = true;

        console.log(this.showPatientHome+" "+this.showPatientRecord);
    }

    //Displays choosed provider value on the home page
    handleProviderChoosed(event){
        console.log(JSON.parse(JSON.stringify(event.detail)));
        this.providerData = event.detail;
        console.log('This is running for provider!');
        this.isHomePage = true;
        this.scheduleButton = false;
        this.showProviderHome = false;
        this.showProviderComponent = false;
        this.showProviderRecord = true;

        console.log(this.showProviderHome+" "+this.showProviderComponent+" "+this.showProviderRecord);   
    }

    //Takes to patient component incase of change of choosed patient record 
    handlePatientChange(){
        this.isHomePage = false;
        this.showPatientComponent = true;
    }
    //Takes to provider component incase of change of choosed provider record 
    handleProviderChange(){
        this.isHomePage = false;
        this.showProviderComponent = true;
    }

    //Displays provider component on clicking fet started button
    handleClickProvider(){
        this.isHomePage = false;
        this.showPatientComponent = false;
        this.showProviderComponent = true;
    }

    //Displays schedule component on clicking fet started button
    handleClickSchedule(){
        this.isHomePage = false;
        this.showPatientComponent = false;
        this.showProviderComponent = false;
        this.showScheduleComponent = true;
    }

    //Navigates back to home page on clicking back to home page button from patient component
    handleBackFromPatient(){
        this.isHomePage = true;
        if(this.showPatientRecord){
            this.showPatientHome = false;
            this.showPatientComponent = false;
            this.showPatientRecord = true;
        }
        else{
            this.showPatientHome = true;
            this.showPatientComponent = false;
        }
    }

    //Navigates back to home page on clicking back to home page button from provider component
    handleBackFromProvider(){
        this.isHomePage = true;
        if(this.showProviderRecord){
            if(this.showPatientRecord){
                this.showPatientHome = false;
                this.showPatientComponent = false;
                this.showPatientRecord = true;
            }
            else{
                this.showPatientHome = true;
                this.showPatientComponent = false;
            }

            this.showProviderHome = false;
            this.showProviderComponent = false;
            this.showProviderRecord = true;
        }
        else{
            if(this.showPatientRecord){
                this.showPatientHome = false;
                this.showPatientComponent = false;
                this.showPatientRecord = true;
            }
            else{
                this.showPatientHome = true;
                this.showPatientComponent = false;
            }

            this.showProviderHome = true;
            this.showProviderComponent = false;
        }
    }

    //Navigates back to home page on clicking back to home page button from schedule component
    handleBackFromSchedule(){
        this.isHomePage = true;
        if(this.showScheduleRecord){
            if(this.showProviderRecord){
                if(this.showPatientRecord){
                    this.showPatientHome = false;
                    this.showPatientComponent = false;
                    this.showPatientRecord = true;

                    this.showProviderHome = false;
                    this.showProviderComponent = false;
                    this.showProviderRecord = true;

                    this.showScheduleHome = false;
                    this.showScheduleComponent = false;
                    this.showScheduleRecord = true;
                }
                else{
                    this.showPatientHome = true;
                    this.showPatientComponent = false;

                    this.showProviderHome = false;
                    this.showProviderComponent = false;
                    this.showProviderRecord = true;
    
                    this.showScheduleHome = false;
                    this.showScheduleComponent = false;
                    this.showScheduleRecord = true;
                }
            }
            else{
                if(this.showPatientRecord){
                    this.showProviderHome = true;
                    this.showProviderComponent = false;

                    this.showPatientHome = false;
                    this.showPatientComponent = false;
                    this.showPatientRecord = true;

                    this.showScheduleHome = false;
                    this.showScheduleComponent = false;
                    this.showScheduleRecord = true;
                }
                else{
                    this.showPatientHome = true;
                    this.showPatientComponent = false;

                    this.showProviderHome = true;
                    this.showProviderComponent = false;

                    this.showScheduleHome = false;
                    this.showScheduleComponent = false;
                    this.showScheduleRecord = true;
                }
            }
        }
        else{
            if(this.showProviderRecord){
                if(this.showPatientRecord){
                    this.showPatientHome = false;
                    this.showPatientComponent = false;
                    this.showPatientRecord = true;

                    this.showProviderHome = false;
                    this.showProviderComponent = false;
                    this.showProviderRecord = true;

                    this.showScheduleHome = true;
                    this.showScheduleComponent = false;
                }
                else{
                    this.showPatientHome = true;
                    this.showPatientComponent = false;

                    this.showProviderHome = false;
                    this.showProviderComponent = false;
                    this.showProviderRecord = true;

                    this.showScheduleHome = true;
                    this.showScheduleComponent = false;
                }
            }
            else{
                if(this.showPatientRecord){
                    this.showPatientHome = false;
                    this.showPatientComponent = false;
                    this.showPatientRecord = true;

                    this.showProviderHome = true;
                    this.showProviderComponent = false;

                    this.showScheduleHome = true;
                    this.showScheduleComponent = false;
                }
                else{
                    this.showPatientHome = true;
                    this.showPatientComponent = false;

                    this.showProviderHome = true;
                    this.showProviderComponent = false;

                    this.showScheduleHome = true;
                    this.showScheduleComponent = false;
                }
            }
        }
    }

    handleScheduleChoosed(event){
        console.log('Schedle running');
        console.log(JSON.parse(JSON.stringify(event.detail)));
        this.schedleData = event.detail;
        this.isHomePage = true;
        this.showScheduleRecord = true;
        this.showScheduleHome = false;
        this.showScheduleComponent = false;
    }

    handleScheduleChange(){
        this.isHomePage = false;
        this.showScheduleComponent = true;
    }
    
}