
import React from "react";
import { Field, FieldArray } from "redux-form";
import { Form, Button } from "reactstrap";
import { countrylist, causes, languages } from "./select-options";
import checkboxesFormArray from "../../components/checkboxesFormArray";

export default function OrganizationForm({ handleSubmit, renderField }) {
    return (
        <Form className="container" onSubmit={handleSubmit} >
            <Field name="name" label="Organization Name: " component={renderField} type="text" />
            <Field name="_parent" label="Parent Org (if any): " component={renderField} type="text" />
            <Field name="funding" label="Are you a Funding Partner ?: " component={renderField} type="select" options={["Yes", "No"]}/>
            <Field name="email" label="E-mail: " component={renderField} type="Email" />
            <Field name="password" label="Password: " component={renderField} type="Password" />
            <Field name="phone" label="Phone: " component={renderField} type="Telephone" />
            <Field name="logo" label="Logo: " component={renderField} type="file" />
            <Field name="person" label="Contact Person: " component={renderField} type="text" />
            <Field name="position" label="Position: " component={renderField} type="text" />
            <Field name="background" label="Background: " component={renderField} type="textarea" />
            <Field name="website" label="Website: " component={renderField} type="url" />
            <Field name="facebook" label="Facebook: " component={renderField} type="url" />
            <FieldArray className="languages" name="languages" label="Languages: " component={checkboxesFormArray} options={languages} />
            <FieldArray className="causes" name="causes" label="Causes: " component={checkboxesFormArray} options={causes}/>
            <Field name="city" label="City: " component={renderField} options={[]} type="text" />
            <Field name="country" label="Country: " component={renderField} type="select" options={countrylist}/>

            <Button type="submit">Submit</Button>
        </Form>
    );
}
