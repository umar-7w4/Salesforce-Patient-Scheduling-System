/**
* @author: Mohammad Umar        
* @version: 1          
* @description: This class returns all patient related details and also creats patient records on personal account object(Account). 
**/

public class Patient {


    /*
    This methods gets all patient records based on the fields provided inside the parameters
    Search mechanism is flexible enough to get all records that matches one or more fields. 
    If none of the field matches it then returns all records with limit of 200
    */    

    @AuraEnabled(cacheable=true)
public static List<Account> getPatientDetails(String firstName, String lastName, String phone, String email, String ssn, String mrn,
                    String country, String city, String state, String zipcode, String street, String dateofBirth){
    System.debug(firstName+' '+lastName+' '+phone+' '+email+' '+ssn+' '+mrn+' '+country+' '+city+' '+state+' '+zipcode+' '+street+' '+dateofBirth);
    String query;

    //Condition to check first name of the patient
    String condition = (String.isNotBlank(firstName) ? 'FirstName LIKE \'' + '%' + firstName + '%\'' : '');

    //Fetching personal account record type Id
    String patientRecordType = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Person Account').getRecordTypeId();
    
    //Condition to check last name of the patient
    condition += (String.isNotBlank(lastName)
    ? (String.isNotBlank(condition) ? +' OR ' : '') +
        ' LastName LIKE \'' +
        '%' +
        lastName +
        '%\''
    : '');

    //Condition for checking phone number value
    condition += (String.isNotBlank(phone)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Phone LIKE \'' +
            '%' +
            phone +
            '%\''
        : '');

    //Condition for checking email address value
    condition += (String.isNotBlank(email)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Email__c LIKE \'' +
            '%' +
            email +
            '%\''
        : '');
    //Condition for checking Social security number value
    condition += (String.isNotBlank(ssn)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' SSN__c LIKE \'' +
            '%' +
            ssn +
            '%\''
        : '');

    //Condition for checking Medical record number value
    condition += (String.isNotBlank(mrn)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' MRN__c LIKE \'' +
            '%' +
            mrn +
            '%\''
        : '');

    //Condition for checking billing country value from billing address
    condition += (String.isNotBlank(country)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' BillingCountry LIKE \'' +
            '%' +
            country +
            '%\''
        : '');

    //Condition for checking billing state value from billing address
    condition += (String.isNotBlank(state)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' BillingState LIKE \'' +
            '%' +
            state +
            '%\''
        : '');

    //Condition for checking billing city value from billing address
    condition += (String.isNotBlank(city)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' BillingCity LIKE \'' +
            '%' +
            city +
            '%\''
        : '');

    //Condition for checking billing street value from billing address
    condition += (String.isNotBlank(street)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' BillingStreet LIKE \'' +
            '%' +
            street +
            '%\''
        : '');

    //Condition for checking billing postal code / zip code value from billing address
    condition += (String.isNotBlank(zipcode)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' BillingPostalCode LIKE \'' +
            '%' +
            zipcode +
            '%\''
        : '');

    //Condition for checking birth date from billing address
    condition += (String.isNotBlank(dateofBirth) ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Birth_Date__c = ' +
            dateofBirth : '');

    //Condition for checking whether record type Id belongs to personal account or not
    String conditionRT = ' RecordTypeId = \''+patientRecordType+'\'';

    //Updating query that fetches all required fields order by name with limit of 200 records
    System.debug('condition '+condition);
        if (String.isNotBlank(condition)) {
            query = 'SELECT Name, FirstName, LastName, Phone, Email__c , SSN__c, MRN__c, BillingCountry, BillingState,  BillingCity, BillingStreet, BillingPostalCode, Birth_Date__c FROM Account WHERE ' +
                '( '+condition +') AND '+conditionRT+
                ' ORDER BY Name';

        } else {
            query = 'SELECT Name, FirstName, LastName, Phone, Email__c , SSN__c, MRN__c, BillingCountry, BillingState,  BillingCity, BillingStreet, BillingPostalCode, Birth_Date__c FROM Account WHERE '+conditionRT+' LIMIT 200';
        }
        //Executing query and storing records inside a list
        System.debug(query);
        List<Account> records = Database.query(query);
        return records;
}

@AuraEnabled(cacheable=true)
public static Account createPatient(String firstName, String lastName, String phone, String email, String ssn, String mrn,
String country, String city, String state, String zipcode, String street, String dateofBirth){
    
    //Fetching personal account record type Id
    System.debug(Schema.SObjectType.Account.getRecordTypeInfosByName().get('Person Account').getRecordTypeId());
    if(String.isNotBlank(lastName) && String.isNotBlank(dateofBirth)){
        Account patient = new Account();
        patient.FirstName = firstName;
        patient.LastName = lastName;
        patient.Phone = phone;
        patient.Email__c = email;
        patient.SSN__c = ssn;
        patient.MRN__c = mrn;
        patient.Birth_Date__c = Date.valueOf(dateofBirth);
        patient.BillingCountry = country;
        patient.BillingState = state;
        patient.BillingCity = city;
        patient.BillingStreet = street;
        patient.BillingPostalCode = zipcode;
        patient.OwnerId = userinfo.getUserId();
        patient.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Person Account').getRecordTypeId();

        //Handling insert related exceptions for inserting patient record
        try{
            insert patient;
        }
        catch(Exception e){
            System.debug(e.getMessage());
            System.debug(e);
        }

        //Quering recently inserted patient record
        Account pat = [Select Name, FirstName, LastName, Phone, Email__c, SSN__c, MRN__c, Birth_Date__c, 
                        BillingCountry, BillingState, BillingCity,BillingStreet, BillingPostalCode From Account where Id =: patient.Id];
        return pat;
    }
    return null;
}

}
