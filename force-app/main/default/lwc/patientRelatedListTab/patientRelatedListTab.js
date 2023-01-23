import { wire, api, LightningElement, track } from 'lwc';
import fetchConditions from '@salesforce/apex/PatientRelatedListClass.getConditions';
import fetchObjectName from '@salesforce/apex/RailcarRelatedListHelper.fetchObjectName';
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
    @wire(fetchRailcars,{recId:'$id'})
    wiredAccounts({ error, data }) 
    {
        if (data)
        {
            this.railcars = JSON.parse( JSON.stringify( data ) );
            this.size=this.railcars.length;
            //logic for converting the Arrival Date in US locale
            for(var i=0;i< this.railcars.length;i++)
            {
                let dt = new Date(this.railcars[i].Arrival_Date__c);
                this.railcars[i].Arrival_Date__c = new Intl.DateTimeFormat('en-US' ).format( dt );
            }
        } 
        else if (error)
        {
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
            else if(this.navToId.startsWith('801')){
                this.objName='Order';
            }
            else{
                this.objName='Railcar__c';
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