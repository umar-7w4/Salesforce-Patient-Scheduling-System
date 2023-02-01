import { wire, api, LightningElement, track } from 'lwc';
import fetchCampaignMemebers from '@salesforce/apex/CampaignMembers.getCampaignMembers';
import fetchObjectName from '@salesforce/apex/CampaignMembers.fetchObjectName';
import { CurrentPageReference ,NavigationMixin} from 'lightning/navigation';
export default class PatientRelatedListTab extends NavigationMixin(LightningElement) {
    
@api id                 //account or order Id from where the viewAll is clicked in railcarsRelatedList component
@track railcars     //stores all railcars records        
size=0              
recordName          //stores Account's Name or OrderNumber to show on the this component
isAccountRelated
    //wire fuction to get the parent record id from the Navigation state
    @wire(CurrentPageReference)
    getPageReferenceParameters(currentPageReference) 
    {
        if (currentPageReference) 
        {
        //console.log(currentPageReference,currentPageReference.state.c__re );
        this.id=currentPageReference.state.c__id;
        if(this.id.startsWith('001')){
            this.isAccountRelated=true;
        }
        else{
            this.isAccountRelated=false;
        }
        }
    }
    @wire(fetchObjectName,{recId:'$id'})
    wireObject({error,data}){
        if(data){
            this.recordName=data;
            this.error=undefined;
        }
        if(error){
            this.error=error;
        }

    }
    //wire function to fetch the related railcar records               
    @wire(fetchCampaignMemebers,{recId:'$id'})
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



//Logic to Navigate to Railcar Record Detail page on click of the Railcar Number link on the component 
    navigateDetails(event)
        {
            // this.navToId = event.target.getAttribute('data-id');
            this.navToId=event.currentTarget.dataset.id;
            console.log(this.navToId);
            this.objName='';
            if(this.navToId.startsWith('001')){
                this.objName='Account';
            }
            //window.close();
            console.log(this.objName);
            this[NavigationMixin.Navigate](
                {
                type:'standard__recordPage',
                attributes:
                    {
                        recordId:this.navToId,
                        objectApiName:this.objName,
                        actionName:'view'
                    }
                });

                    
        }


}