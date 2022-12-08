import { LightningElement } from 'lwc';

export default class ProviderComponent extends LightningElement {

    value = 'Select gender';

    get options() {
        return [
            { label: 'Select gender', value: 'Select gender' },
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
        ];
    }

    handleGenderChange(event) {
        this.value = event.detail.value;
    }
}