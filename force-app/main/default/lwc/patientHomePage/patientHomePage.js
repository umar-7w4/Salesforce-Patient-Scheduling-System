import { LightningElement, api, wire, track  } from 'lwc';
import Account from '@salesforce/schema/Account';
import GETPATIENTSFORHOME from "@salesforce/apex/PatientFull.getPatientDetails";
import NAME from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.PersonMobilePhone';
import EMAIL_FIELD from '@salesforce/schema/Account.PersonEmail';
import SSN_FIELD from '@salesforce/schema/Account.SSN__pc';


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
    }
];

export default class PatientHomePage extends LightningElement {


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
  
    handleName(event) {
        this.accountName = event.detail.value;
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
        GETPATIENTSFORHOME({ 
            name : this.accountName,
            phone : this.phone, 
            email : this.email,
            ssn : this.ssn
        })
        .then(result => {
            this.accounts = result;
            this.resultLength = this.accounts.length;
            console.log(this.accounts);
            console.log(this.ssn+" "+this.accountName+" "+this.phone+" "+this.email);
            if(this.resultLength>4){
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

} 