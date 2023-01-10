import { LightningElement,track,wire } from 'lwc';
import getEvents from '@salesforce/apex/EventController.getEvents';

export default class CalenderTest extends LightningElement {
  @track startDate=new Date();
  @track endDate;
  error;
  openModal = false;
  @track events=[];
  @wire(getEvents)
    eventObj(value){
        const {data, error} = value;
        if(data){
            //format as fullcalendar event object
            let records = data.map(event => {
                return { Id : event.Id, 
                        title : event.Subject, 
                        start : event.StartDateTime,
                        end : event.EndDateTime,
                        allDay : event.IsAllDayEvent};
            });
            this.events = JSON.parse(JSON.stringify(records));
            this.error = undefined;
        }else if(error){
            this.events = [];
            this.error = 'No events are found';
        }
   }
    handleEvent(event) {
      var id=event.detail;
      let task = this.events.find(x=>x.Id=id);
      this.startDate=task.start;
      this.title=task.title;
      this.endDate=task.end;
      this.openModal = true;
      
    }
    handleCancel(event) {
      this.openModal = false;
    }
}