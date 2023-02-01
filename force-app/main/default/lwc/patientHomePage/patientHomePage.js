import { LightningElement, api, wire, track  } from 'lwc';
import Account from '@salesforce/schema/Account';
import GETPATIENTSFORHOME from "@salesforce/apex/PatientFull.getPatientDetails";
import NAME from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.PersonMobilePhone';
import EMAIL_FIELD from '@salesforce/schema/Account.PersonEmail';
import SSN_FIELD from '@salesforce/schema/Account.SSN__pc';
import BIRTHDATE from '@salesforce/schema/Account.HealthCloudGA__BirthDate__pc';
import { NavigationMixin } from 'lightning/navigation'; 


const COLS = [

    {
        label: 'Name',
        fieldName: NAME.fieldApiName,
        editable: true
    },
    {
        label: 'Phone',
        fieldName: PHONE_FIELD.fieldApiName,
        type: 'phone',
        editable: true
    },
    {
        label: 'Email',
        fieldName: EMAIL_FIELD.fieldApiName,
        type: 'email',
        editable: true
    },
    { 
        label: 'SSN', 
        fieldName: SSN_FIELD.fieldApiName, 
        editable: true 
    },
    {
        label: 'Birth Date',
        fieldName: BIRTHDATE.fieldApiName,
        type: 'date',
        typeAttributes: {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          },
        editable: true 
    }
];

export default class PatientHomePage extends NavigationMixin(LightningElement) {


    objectApiName = Account;

    @api accounts = [];
    @api limitedAccounts = [];
    columns = COLS;
    //Stores length of search results records 
    resultLength = 0;

    expand = false;

    @api accountName;
    @api phone;
    @api email;
    @api ssn;
    @api dateofBirth;
  
    handleName(event) {
        this.accountName = event.detail.value;
    }

    handleDateChange(event) {
        this.dateofBirth = event.detail.value;
    }
  
    handlePhoneChange(event) {
        this.phone = event.detail.value;
    }
  
    handleEmailChange(event) {
        this.email = event.detail.value;
    }
  
    handleSSNChange(event) {
        this.ssn = event.detail.value;
    }


    handleSubmit(event){
        if(this.dateofBirth!=undefined){
            let x = new Date(this.dateofBirth);
            let op = {year: 'numeric', month: 'long', day:'numeric'};
            this.dateofBirth = new Intl.DateTimeFormat('en-US', op).format(x)
            console.log(this.dateofBirth);
        }
        GETPATIENTSFORHOME({ 
            name : this.accountName,
            phone : this.phone, 
            email : this.email,
            ssn : this.ssn,
            birthDate : this.dateofBirth
        })
        .then(result => {
            this.accounts = result;
            this.resultLength = this.accounts.length;
            console.log(this.accounts);
            console.log(this.dateofBirth+" "+this.ssn+" "+this.accountName+" "+this.phone+" "+this.email);
            if(this.resultLength>4){
                console.log(event.target.getAttribute('data-id'));
                this.limitedAccounts=[this.accounts[0] , this.accounts[1], this.accounts[2], this.accounts[3]];
                this.expand = false;
            }
            else{
                this.limitedAccounts=[...this.accounts];
                this.expand = false;
            }
            this.dispatchEvent(event);
        })
        .catch(error => {
            console.log(error);
            this.dispatchEvent(event);
        });

    }

    handleClick(){
        this.expand = true;
        this.resultLength = undefined;
    }

    handleClickNavigate(event) {
        // Stop the event's default behavior (don't follow the HREF link) and prevent click bubbling up in the DOM...
        event.preventDefault();
        event.stopPropagation();
        // Navigate as requested...        
        console.log(event.target.dataset.recordId);
        this.navigateDetails(event.target.dataset.recordId);
   }

    navigateDetails(navId){
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:
            {
                recordId:navId,
                objectApiName:'Account',
                actionName:'view'
            }
        });
    }
}
