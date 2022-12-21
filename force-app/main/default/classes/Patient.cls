public class Patient {

@AuraEnabled
public static List<Account> getPatientDetails(String firstName, String lastName, String phone, String email, String ssn, String mrn,
                    String country, String city, String state, String zipcode, String street, String dateofBirth){
    System.debug(firstName+' '+lastName+' '+phone+' '+email+' '+ssn+' '+mrn+' '+country+' '+city+' '+state+' '+zipcode+' '+street+' '+dateofBirth);
    String query;
    String condition = (String.isNotBlank(firstName) ? 'FirstName LIKE \'' + '%' + firstName + '%\'' : '');
    String patientRecordType = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Person Account').getRecordTypeId();
    
    condition += (String.isNotBlank(lastName)
    ? (String.isNotBlank(condition) ? +' OR ' : '') +
        ' LastName LIKE \'' +
        '%' +
        lastName +
        '%\''
    : '');

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

    String conditionRT = ' RecordTypeId = \''+patientRecordType+'\'';

    System.debug('condition '+condition);
        if (String.isNotBlank(condition)) {
            query = 'SELECT Name, FirstName, LastName, Phone, Email__c , SSN__c, MRN__c, BillingCountry, BillingState,  BillingCity, BillingStreet, BillingPostalCode, Birth_Date__c FROM Account WHERE ' +
                '( '+condition +') AND '+conditionRT+
                ' ORDER BY Name';

        } else {
            query = 'SELECT Name, FirstName, LastName, Phone, Email__c , SSN__c, MRN__c, BillingCountry, BillingState,  BillingCity, BillingStreet, BillingPostalCode, Birth_Date__c FROM Account WHERE '+conditionRT+' LIMIT 200';
        }
        System.debug(query);
        List<Account> records = Database.query(query);
        return records;
}

@AuraEnabled
public static Account createPatient(String firstName, String lastName, String phone, String email, String ssn, String mrn,
String country, String city, String state, String zipcode, String street, String dateofBirth){
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

        try{
            insert patient;
        }
        catch(Exception e){
            System.debug(e.getMessage());
            System.debug(e);
        }

        Account pat = [Select Name, FirstName, LastName, Phone, Email__c, SSN__c, MRN__c, Birth_Date__c, 
                        BillingCountry, BillingState, BillingCity,BillingStreet, BillingPostalCode From Account where Id =: patient.Id];
        return pat;
    }
    return null;
}

}
