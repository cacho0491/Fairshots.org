import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import formConfiguration from "./formConfiguration";
import { MultipartForm } from "../../components/UI";
import { postProject, putProject } from "../../actions";

/**
 * Holds and handle form to create or update projects
 * @extends Component
 * @param newOne true if new project , undefined or false if update Project
 */
class ProjectForm extends Component {
    state = {
        activeStep: 0,
        dataSend: false,
        steps: [
            {
                title: "Project details"
            },
            {
                title: "References",
                description:
                    "Upload up to 5 reference images. A visual reference can help you describe what type of images you are after. These can be images of previous jobs you have done or something you might have seen online, not necessarily only photographs, but styles and brands can help enforce what you are trying to convey. You can upload as many as 5 visual references. Max individual files size 1mb."
            },
            {
                title: "Location",
                description: "Where is this happening?"
            },
            {
                title: "Dates",
                description: "When is this happening?"
            },
            {
                title: "Funds and incentives"
            },
            {
                title: "Applicants"
            }
        ],
        form: formConfiguration.form
    };

    preprocessFormBeforeSubmit = form => {
        const formData = Object.keys(form)
            .map(i => {
                // adjusts data collected to conform with backend API
                if (i === "FundingOptions") {
                    if (form[i].config.value.includes("no fund")) return { [i]: "No Funds" };
                    if (form[i].config.value.includes("expenses")) return { [i]: "Expenses" };
                    if (form[i].config.value.includes("photographer"))
                        return { [i]: "Photographer" };
                } else if (i === "GeographicRestriction") {
                    if (form[i].config.value.includes("anywhere")) return { [i]: "Anywhere" };
                    if (form[i].config.value.includes("continent")) return { [i]: "Continent" };
                    if (form[i].config.value.includes("country")) return { [i]: "Country" };
                    if (form[i].config.value.includes("region")) return { [i]: "Region" };
                    if (form[i].config.value.includes("town")) return { [i]: "Region" };
                } else if (i === "ProfessionalOnly") {
                    if (form[i].config.value) return true;
                    if (form[i].config.value.includes("Only professional")) return { [i]: true };
                    return { [i]: false };
                } else if (i === "FundsFairshot") {
                    if (form[i].config.value === "yes") return { [i]: true };
                    return { [i]: false };
                } else if (i === "Duration") return { [i]: parseInt(form[i].config.value, 10) };
                else if (i === "PhotographersNeeded")
                    return { [i]: parseInt(form[i].config.value, 10) };

                return { [i]: form[i].config.value };
            })
            .reduce((acc, cur) => ({ ...acc, ...cur }));

        if (!this.props.newOne) {
            const { projId } = this.props.match.params;
            const project = this.props.projects[projId];

            const updateForm = Object.keys(formData)
                .filter(key => formData[key] !== project[key])
                .reduce((obj, i) => ({ ...obj, [i]: formData[i] }), {});
            return updateForm;
        }
        return formData;
    };

    formSubmitHandler = e => {
        e.preventDefault();
        const { form } = this.state;

        const formData = this.preprocessFormBeforeSubmit(form);

        if (this.props.newOne)
            this.props.createProject(formData, this.props.authId, this.props.token);
        else {
            this.props.updateProject(formData, this.props.match.params.projId, this.props.token);
        }
    };

    populateUpdateForm = projId => {
        const { form } = this.state;
        const project = this.props.projects[projId];

        const formData = Object.keys(form)
            .map(i => ({
                [i]: {
                    ...form[i],
                    config: {
                        ...form[i].config,
                        value:
                            i.includes("Date") || i.includes("Delivery")
                                ? project[i].split("T")[0]
                                : project[i],
                        valid: true,
                        touched: true
                    }
                }
            }))
            .reduce((acc, cur) => ({ ...acc, ...cur }));

        this.setState({ form: formData });
    };

    componentDidMount() {
        if (!this.props.newOne) {
            const { projId } = this.props.match.params;
            this.populateUpdateForm(projId);
        }
    }

    componentDidUpdate(prevProps) {
        if (Object.keys(this.props.projects).length > Object.keys(prevProps.projects).length) {
            this.setState({ dataSend: !this.state.dataSend });
        }
    }

    checkValidity = (value, rules) => {
        let isValid = false;

        if (rules.required) {
            isValid = value.trim() !== "";
        } else {
            isValid = true;
        }

        return isValid;
    };

    onBlur = inputIdentifier => e => {
        const { validationRules } = this.state.form[inputIdentifier].config;
        const { value } = e.target;

        const form = {
            ...this.state.form,
            [inputIdentifier]: {
                ...this.state.form[inputIdentifier],
                config: {
                    ...this.state.form[inputIdentifier].config,
                    valid: this.checkValidity(value, validationRules),
                    touched: true
                }
            }
        };

        this.setState({ form });
    };

    inputChangeHandler = inputIdentifier => e => {
        let form;
        if (inputIdentifier === "Photos") {
            form = {
                ...this.state.form
            };
            if (e.includes("del")) {
                const el = e.split(" ")[1];
                const filtered = form.Photos.config.value.filter(val => val.cloudlink !== el);
                form.Photos.config.value = filtered;
            } else {
                form.Photos.config.value.push({ cloudlink: e });
            }
        } else {
            const { value } = e.target;

            form = {
                ...this.state.form,
                [inputIdentifier]: {
                    ...this.state.form[inputIdentifier],
                    config: {
                        ...this.state.form[inputIdentifier].config,
                        value
                    }
                }
            };
        }
        this.setState({ form });
    };

    render() {
        const { activeStep, steps, dataSend, form } = this.state;
        const { errorMessage, newOne } = this.props;
        const formElementsArray = Object.keys(form).map(key => ({
            id: key,
            config: form[key]
        }));

        return (
            <div className="d-flex flex-column flex-wrap align-items-center">
                <MultipartForm
                    onSubmit={this.formSubmitHandler}
                    activeStep={activeStep}
                    steps={steps}
                    data={formElementsArray}
                    changeHandler={this.inputChangeHandler}
                    onBlur={this.onBlur}
                    dataSend={dataSend}
                    errorMessage={errorMessage}
                >
                    {newOne ? "Create a new project" : "Update project"}
                </MultipartForm>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    token: state.auth.user.token,
    authId: state.auth.user.userId,
    errorMessage: state.project.error,
    projects: state.project
});

const mapDispatchToProps = dispatch => ({
    createProject: (formProps, id, token) => {
        dispatch(postProject(formProps, id, token));
    },
    updateProject: (formProps, id, token) => {
        dispatch(putProject(formProps, id, token));
    }
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ProjectForm)
);
