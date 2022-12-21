public class Provider {

    @AuraEnabled
    public static List<Provider__c> getProviders(String firstName, String lastName, String gender, String inNetwork, String taxonomy, DateTime startTime, DateTime endTime, String distance, String speciality, String location){

        System.debug(firstName+' '+lastName+' '+gender+' '+inNetwork+' '+taxonomy+' '+startTime+' '+endTime+' '+distance+' '+speciality+' '+location);
        String query;
        String condition = (String.isNotBlank(firstName) ? 'First_Name__c LIKE \'' + '%' + firstName + '%\'' : '');

        condition += (String.isNotBlank(lastName)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Last_Name__c LIKE \'' +
            '%' +
            lastName +
            '%\''
        : '');

        condition += (String.isNotBlank(gender)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Gender__c = \'' +
            gender +
            '\''
        : '');  

        condition += (String.isNotBlank(inNetwork)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' In_Network__c = \'' +
            inNetwork +
            '\''
        : '');

        condition += (startTime != null
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            '( Start_Time__c >= ' +
            startTime.formatGMT('yyyy-MM-dd\'T\'HH:mm:ss\'Z\'') : '');


        condition += (endTime != null
        ? (String.isNotBlank(condition) ? +' AND ' : '') +
            ' End_Time__c <= ' +
            endTime.formatGMT('yyyy-MM-dd\'T\'HH:mm:ss\'Z\'') +' )' : '');       

        condition += (String.isNotBlank(taxonomy)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Taxonomy__c LIKE \'' +
            '%' +
            taxonomy +
            '%\''
        : '');


        condition += (String.isNotBlank(location)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Location__c LIKE \'' +
            '%' +
            location +
            '%\''
        : '');

        condition += (String.isNotBlank(distance)
        ? (String.isNotBlank(condition) ? +' OR ' : '') +
            ' Distance__c = \'' +
            distance +
            '\''
        : '');

        System.debug('condition '+condition);
        if (String.isNotBlank(condition)) {
            query = 'SELECT Id, First_Name__c, Last_Name__c, Gender__c, In_Network__c, Start_Time__c, End_Time__c, Speciality__c, Taxonomy__c, Location__c, Distance__c, Provider_Name__c FROM Provider__c WHERE ' +
                condition+' ORDER BY Provider_Name__c';

        } else if(speciality == null){
            query = 'SELECT Id,  First_Name__c, Last_Name__c, Gender__c, In_Network__c, Start_Time__c, End_Time__c, Speciality__c, Taxonomy__c, Location__c, Distance__c, Provider_Name__c FROM Provider__c LIMIT 200';
        }
        System.debug(query);
        List<Provider__c> records = new List<Provider__c>();
        if(query != null){
            try{
                records = Database.query(query);
            }
            catch(Exception e){
                System.debug(e.getMessage());
            }
        }
        List<String> providerIds = new List<String>();
        if(records.size()>0){
            for(Provider__c i : records){
                providerIds.add(i.Id);
            }
        }
        
        if(speciality != null){
            System.debug('==');
            for(Provider__c i: [SELECT Id, Gender__c, In_Network__c, Start_Time__c, End_Time__c, Speciality__c, Taxonomy__c, Location__c, Distance__c, Provider_Name__c FROM Provider__c]){
                List<String> specialities = new List<String>();
                specialities.addAll(i.Speciality__c.split(';'));
                if(specialities.contains(speciality) && providerIds.contains(i.Id)==false){
                    providerIds.add(i.Id);
                    records.add(i);
                    System.debug('-');
                    System.debug(specialities);
                }
            }
        }

        return records;

    }

}
