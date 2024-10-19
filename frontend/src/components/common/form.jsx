/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { FormLabel } from "../ui/form";

const types = {
  INPUT: "input",
  SELECT: "select",
  TEXTAREA: "textarea",
  RADIO: "radio",
};

const CommonForm = ({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  function renderInput(control) {
    let element = null;
    const value = formData[control.name] || "";

    const commonProps = {
      name: control.name,
      placeholder: control.placeholder,
      id: control.name,
      value: value,
      onChange: (e) =>
        setFormData({ ...formData, [control.name]: e.target.value }),
      readOnly: control.readOnly, // Add readOnly here
    };

    switch (control.componentType) {
      case types.INPUT:
        element = <Input {...commonProps} type={control.type} />;
        break;

      case types.SELECT:
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [control.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={control.label} />
            </SelectTrigger>
            <SelectContent>
              {control.options && control.options.length > 0
                ? control.options.map((option, index) => (
                    <SelectItem key={index} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;

      case types.RADIO:
        element = (
          <RadioGroup
            value={formData[control.name]}
            onValueChange={(value) =>
              setFormData({ ...formData, [control.name]: value })
            }
          >
            {control.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <label htmlFor={option.id}>{option.name}</label>
              </div>
            ))}
          </RadioGroup>
        );
        break;

      case types.DATEPICKER:
        element = (
          <>
            <FormLabel>Date of birth</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "Pick a date"}
                  <CalendarIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setFormData({ ...formData, [control.name]: date });
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </>
        );
        break;

      case types.TEXTAREA:
        element = <Textarea {...commonProps} />;
        break;

      default:
        element = <Input {...commonProps} type={control.type} />;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((control, index) => (
          <div className="w-full gap-1.5" key={index}>
            <Label className="mb-1">{control.label}</Label>
            {renderInput(control)}
          </div>
        ))}
      </div>
      <Button type="submit" className="mt-4 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
};

CommonForm.propTypes = {
  formControls: PropTypes.array.isRequired,
};

export default CommonForm;
