import { api, LightningElement, track, wire } from 'lwc';
import fetchConditions from '@salesforce/apex/PatientRelatedListClass.getConditions';
import fetchEncounters from '@salesforce/apex/PatientRelatedListClass.getClinicalEncounters';
import fetchMedications from '@salesforce/apex/PatientRelatedListClass.getMedications';
import { NavigationMixin } from 'lightning/navigation'; 
export default class PatientRelatedList extends NavigationMixin(LightningElement) {
    @api recordId

    @track railcars             //contains all railcar records
    @track rails   =[]             //contains only 2 railcar records
    showViewAll=false           //holds the returned railcar records
    size=0                      //holds the number of available reords in railcars variable
    //Wired function for Fetching Related Railcar Records
    @wire(fetchConditions,{recId:'$recordId'})
    wiredAccounts({ error, data }) {
        console.log('Heyyyyy man');
        if (data) {
            this.railcars = JSON.parse( JSON.stringify( data ) );
            this.size=this.railcars.length;
            console.log(this.railcars);
            console.log(this.size);
            //logic to decide whether to show view All button or not
            if(this.size>5)
            {
                this.showViewAll=true;
            }
            console.log(this.railcars);
            if(this.size>5)
            {
                this.rails=[this.railcars[0] , this.railcars[1], this.railcars[2], this.railcars[3], this.railcars[4]];
            }
            else{
                this.rails=[...this.railcars];
            }
        } 
        else if (error) {
            console.log('Error');
            console.log(error);
            this.error = error;
        }
    }


    @track encounters             //contains all railcar records
    @track clinicalEncounters   =[]             //contains only 2 railcar records
    showViewAllEncounters=false           //holds the returned railcar records
    encounterSize=0                      //holds the number of available reords in railcars variable
    //Wired function for Fetching Related Railcar Records
    @wire(fetchEncounters,{recId:'$recordId'})
    wiredEncounters({ error, data }) {
        console.log('Heyyyyy man 2');
        if (data) {
            this.encounters = JSON.parse( JSON.stringify( data ) );
            this.encounterSize=this.encounters.length;
            console.log(this.encounters);
            console.log(this.encounterSize);
            //logic to decide whether to show view All button or not
            if(this.encounterSize>5)
            {
                this.showViewAllEncounters=true;
            }
            console.log(this.encounters);
            if(this.encounterSize>5)
            {
                this.clinicalEncounters=[this.encounters[0] , this.encounters[1], this.encounters[2], this.encounters[3], this.encounters[4]];
            }
            else{
                this.clinicalEncounters=[...this.encounters];
            }
        } 
        else if (error) {
            console.log('Error');
            console.log(error);
            this.error = error;
        }
    }
/*
    @track railcars             //contains all railcar records
    @track rails   =[]             //contains only 2 railcar records
    showViewAll=false           //holds the returned railcar records
    size=0                      //holds the number of available reords in railcars variable
    //Wired function for Fetching Related Railcar Records
    @wire(fetchMedications,{recId:'$recordId'})
    wiredAccounts({ error, data }) {
        console.log('Heyyyyy man');
        if (data) {
            this.railcars = JSON.parse( JSON.stringify( data ) );
            this.size=this.railcars.length;
            console.log(this.railcars);
            console.log(this.size);
            //logic to decide whether to show view All button or not
            if(this.size>5)
            {
                this.showViewAll=true;
            }
            console.log(this.railcars);
            if(this.size>5)
            {
                this.rails=[this.railcars[0] , this.railcars[1], this.railcars[2], this.railcars[3], this.railcars[4]];
            }
            else{
                this.rails=[...this.railcars];
            }
        } 
        else if (error) {
            console.log('Error');
            console.log(error);
            this.error = error;
        }
    }*/

    //logic to handle navigation functionality when clicking view all button
    

    //Logic to Navigate to Railcar Record Detail page on click of the Railcar Number link on the component 
    navigateDetails(event){
        this.RailcarId = event.target.getAttribute('data-id');
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:
            {
                recordId:this.RailcarId,
                objectApiName:'Condition__c',
                actionName:'view'
            }
        });
    }

    
}