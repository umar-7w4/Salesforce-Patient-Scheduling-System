import { api, LightningElement, track, wire } from 'lwc';

import fetchCampaignMemebers from '@salesforce/apex/CampaignMembers.getCampaignMembers';
import createCampaignMemebers from '@salesforce/apex/CampaignMembers.createCampaignMember';
import { NavigationMixin } from 'lightning/navigation'; 

export default class AddCampaignMembers extends NavigationMixin(LightningElement) {
    @api recordId

    showModal = false;

    @track railcars             //contains all railcar records
    @track rails   =[]             //contains only 2 railcar records
    showViewAll=false           //holds the returned railcar records
    size=0                      //holds the number of available reords in railcars variable
    //Wired function for Fetching Related Railcar Records
    @wire(fetchCampaignMemebers,{recId:'$recordId'})
    wiredAccounts({ error, data }) {
        console.log('Heyyyyy man');
        if (data) {
            this.railcars = JSON.parse( JSON.stringify( data ) );
            this.size=this.railcars.length;
            console.log(this.railcars);
            console.log(this.size);
            console.log(this.recordId);
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

    handleClick(){
        this.showModal = true;
    }

    hideModalBox(){
        this.showModal = false;
    }

    accountId;
    CampaignId;

    get statusValues(){
        return [
            { label: 'Planned', value: 'Planned' },
            { label: 'Sent', value: 'Sent' },
            { label: 'Received', value: 'Received' },
            { label: 'Responded', value: 'Responded' },
        ];
    }

    value = '';

    updateDecision;

    get options() {
        return [
            { label: 'Keep member status', value: 'Keep member status' },
            { label: 'Overwrite member status', value: 'Overwrite member status' },
        ];
    }

    handleSelectedLookup(event) {
        this.accountId = event.detail;
    }
    
    handleSelectedLookup2(event) {
        this.CampaignId = event.detail;
    }

    handleUpdateDecision(event) {
        this.updateDecision = event.detail;
    }

    status; 

    handleStatus(event){
        this.status = event.detail.value;
    }

    handleSubmit(event){
        createCampaignMemebers({ 
            accId:this.accountId,
            campId:this.CampaignId,
            status: this.status
        })
        .then(result => {
            console.log(this.accountId+' '+this.CampaignId+' '+this.status);
            console.log(result);
            this.dispatchEvent(event);
        })
        .catch(error => {
            console.log(error);
            const event = new ShowToastEvent({
                title : 'Error',
                message : 'Enter data properly!',
                variant : 'error'
            });
            this.dispatchEvent(event);
        });

    }



}