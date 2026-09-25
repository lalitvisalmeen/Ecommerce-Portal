import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidator {

    // create custom validator to check whitespaces in a field
    static whiteSpace(control: FormControl) : ValidationErrors | null{
        // check the formcontrol value has whitespaces
        if(control.value != null && control.value.trim().length === 0){
            // if yes then return an error object
            return {"whitespace": true};
        }
        else{
            // if the field does not have any whitespaces then return null
            return null;
        }

    }

    // This is to check the length < min even after the trim
    static minLengthAfterTrim(min : number) : ValidatorFn{
        return (control : AbstractControl): ValidationErrors | null => {
            if(control.value != null && control.value.trim().length < min){
                return {"minLengthTrim": true};
            }
            return null;
        };
    }
}
