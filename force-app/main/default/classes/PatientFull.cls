public class PatientFull {



@AuraEnabled(cacheable=true)
public static List<Account> getPatientDetails(String name, String ssn, String phone, String email, String birthDate){

    String query;

    System.debug(birthDate);
    //Condition to check first name of the patient
    String condition = (String.isNotBlank(name) ? 'Name LIKE \'' + '%' + name + '%\'' : '');

    //Fetching personal account record type Id
    String patientRecordType = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Person Account').getRecordTypeId();
    
    //Condition to check last name of the patient
    condition += (String.isNotBlank(ssn)
    ? (String.isNotBlank(condition) ? +' OR ' : '') +
        ' SSN__pc LIKE \'' +
        '%' +
        ssn +
        '%\''
    : '');

    //Condition for checking phone number value
    condition += (String.isNotBlank(phone)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' PersonMobilePhone LIKE \'' +
            '%' +
            phone +
            '%\''
        : '');

    //Condition for checking email address value
    condition += (String.isNotBlank(email)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' PersonEmail LIKE \'' +
            '%' +
            email +
            '%\''
        : '');
    
    //Condition for checking birth date from billing address
    condition += (String.isNotBlank(birthDate)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' HealthCloudGA__BirthDate__pc LIKE \'' +
            '%' +
            birthDate +
            '%\''
        : '');


    //Condition for checking whether record type Id belongs to personal account or not
    String conditionRT = ' RecordTypeId = \''+patientRecordType+'\'';

    //Updating query that fetches all required fields order by name with limit of 200 records
    System.debug('condition '+condition);
        if (String.isNotBlank(condition)) {
            query = 'SELECT Name, Phone, PersonMobilePhone , PersonEmail , SSN__pc , HealthCloudGA__BirthDate__pc, BillingAddress, BillingCity, BillingCountry, BillingState, BillingStreet, Race__pc FROM Account WHERE ' +
                '( '+condition +') AND '+conditionRT+
                ' ORDER BY Name';

        } else {
            query = 'SELECT Name, Phone, PersonMobilePhone , PersonEmail , SSN__pc , HealthCloudGA__BirthDate__pc, BillingAddress, BillingCity, BillingCountry, BillingState, BillingStreet, Race__pc FROM Account WHERE '+conditionRT+' LIMIT 200';
        }
        //Executing query and storing records inside a list
        System.debug(query);
        List<Account> records = Database.query(query);

        for(Account i : records){
            Integer x = i.SSN__pc.length()-4;
            i.SSN__pc = (multiply(x))+i.SSN__pc.substring(i.SSN__pc.length()-4, i.SSN__pc.length());
        }
        return records;
}

@AuraEnabled(cacheable=true)
public static String multiply(Integer x){
    String ans = '';
    for(Integer i = 0;i<x;i++){
        ans+='*';
    }
    return ans;
}

}
