public with sharing class Patient {

@AuraEnabled
public static List<Account> getPatientDetails(String name, String phone, String email, String ssn, String mrn,
                    String country, String city, String state, String zipcode, String street, String dateofBirth){
    System.debug(name+' '+phone+' '+email+' '+ssn+' '+mrn+' '+country+' '+city+' '+state+' '+zipcode+' '+street+' '+dateofBirth);
    String query;
    String condition = (String.isNotBlank(name) ? 'Name LIKE \'' + '%' + name + '%\'' : '');

    condition += (String.isNotBlank(phone)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Phone LIKE \'' +
            '%' +
            phone +
            '%\''
        : '');

    condition += (String.isNotBlank(email)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Email__c LIKE \'' +
            '%' +
            email +
            '%\''
        : '');

    condition += (String.isNotBlank(ssn)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' SSN__c LIKE \'' +
            '%' +
            ssn +
            '%\''
        : '');

    condition += (String.isNotBlank(mrn)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' MRN__c LIKE \'' +
            '%' +
            mrn +
            '%\''
        : '');

    condition += (String.isNotBlank(country)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' BillingCountry LIKE \'' +
            '%' +
            country +
            '%\''
        : '');

    condition += (String.isNotBlank(state)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' BillingState LIKE \'' +
            '%' +
            state +
            '%\''
        : '');

    condition += (String.isNotBlank(city)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' BillingCity LIKE \'' +
            '%' +
            city +
            '%\''
        : '');

    condition += (String.isNotBlank(street)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' BillingStreet LIKE \'' +
            '%' +
            street +
            '%\''
        : '');

    condition += (String.isNotBlank(zipcode)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' BillingPostalCode LIKE \'' +
            '%' +
            zipcode +
            '%\''
        : '');

    condition += (String.isNotBlank(dateofBirth) ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Birth_Date__c = ' +
            dateofBirth : '');

    System.debug('condition '+condition);
        if (String.isNotBlank(condition)) {
            query = 'SELECT Name, Phone, Email__c , SSN__c, MRN__c, BillingCountry, BillingState,  BillingCity, BillingStreet, BillingPostalCode, Birth_Date__c FROM Account WHERE ' +
                condition +
                ' ORDER BY Name';
        } else {
            query = 'SELECT Name, Phone, Email__c , SSN__c, MRN__c, BillingCountry, BillingState,  BillingCity, BillingStreet, BillingPostalCode, Birth_Date__c FROM Account LIMIT 200';
        }

        List<Account> records = Database.query(query);
        return records;
}

@AuraEnabled
public static void createPatient(String name, String phone, String email, String ssn, String mrn,
String country, String city, String state, String zipcode, String street, String dateofBirth){
    System.debug(dateofBirth);
    if(String.isNotBlank(name)){
        Account patient = new Account();
        patient.Name = name;
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
        insert patient;
    }
}

}
