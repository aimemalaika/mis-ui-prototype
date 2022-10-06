const SERVER = "http://127.0.0.1:8000/api/v1";

const add_notify = (stastus, message) => {
    return `
        <div class="toast-header">
            <img src="./favicon-16x16.png" class="rounded me-2" alt="...">
            <strong class="me-auto">${stastus}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
};


const is_logged_in = async () => {
    const request = await fetch(`${SERVER}/authentication/auth`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "JWT_AUD": "test",
            "Authorization": localStorage.getItem('token')
        },
    });
    return await (request.status === 200) ? true : false;
}

// get all campus programs
const getAllPrograms = async (program) => {
    const request = await fetch(`${SERVER}/campus/${program}/campus_program/opened_programs`);
    const response = await request.json();
    return response;
};
// get all programs


// get all campuses
const getAllCampuses = async () => {
    const request = await fetch(`${SERVER}/campus/opened_campuses`);
    const response = await request.json();
    return response;
};
// get all campuses


// get all campus programs schools
const getAllProgramsSchools = async (campus_program) => {
    const request = await fetch(`${SERVER}/campus_program/${campus_program}/campus_program_school/opened_schools`);
    const response = await request.json();
    return response;
};
// get all campus programs

// get all departments
const getAllDepartments = async (school) => {
    const request = await fetch(`${SERVER}/school/${school}/department/opened_departments`);
    const response = await request.json();
    return response;
};

// get academic year
const getAcademicYear = async (department) => {
    const request = await fetch(`${SERVER}/academic_year_department/opened_years?department_id=${department}`);
    const response = await request.json();
    return response;
};

// get academic year classes
const getAcademicYearClasses = async (academic_year) => {
    const request = await fetch(`${SERVER}/academic_year_department/${academic_year}/department_class`);
    const response = await request.json();
    return response;
};

// get academic year classes intake
const getAcademicYearClassesIntake = async (academic_year_class) => {
    const request = await fetch(`${SERVER}/department_class/${academic_year_class}/intake/opened_intakes`);
    const response = await request.json();
    return response;
};

// get academic year classes intake sections
const getAcademicYearClassesIntakeSections = async (intake) => {
    const request = await fetch(`${SERVER}/intake/opened_sections?intake_id=${intake}`);
    const response = await request.json();
    return response;
};

// login user
const loginUser = async (email, password) => {
    const request = await fetch(`${SERVER}/signin/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "JWT_AUD": "test",
        },
        body: JSON.stringify({
            "user": {
                email: email,
                password: password
            }
        }),
    });
    const response = await request.json();
    if (request.status === 200) {
        response.status = 'success';
        response.token = request.headers.get('Authorization');
    } else {
        response.status = 'error'
    }
    return response
}
// login user


// register user
const registerUser = async (first_name, last_name, email, password, password_confirmation) => {
    const request = await fetch(`${SERVER}/signup/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "user": {
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password,
                password_confirmation: password_confirmation
            }
        }),
    });
    const response = await request.json();
    if (request.status === 201) {
        response.status = 'success';
    } else {
        response.status = 'error'
    }
    return response
}


$(document).ready(function () {
    const login_status = is_logged_in();
    login_status.then((status) => {
        if (status && localStorage.getItem('token') && localStorage.getItem('user')) {
            const profile = JSON.parse(localStorage.getItem('user'));
            const {
                first_name,
                last_name
            } = profile.attributes;
            $("#profile_name").html(`<a class="nav-link bg-success text-white" href="logout.html">${first_name} ${last_name}</a>`);
        } else {
            $("#profile_name").html(`<a class="nav-link" href="login.html">Login</a>`)
            $("#navigation_list").append(`<a class="nav-link" href="register.html">Register</a>`)
        }
    });

    // list campuses
    const campuses = getAllCampuses();
    campuses.then((campuses) => {
        const {
            data
        } = campuses;
        data.map((campus) => {
            const {
                name,
                website
            } = campus.attributes;
            $("#our-campuses").append(
                `<a href="${website}">Visit us in ${name}</a>`
            )
            $("#campus").append(
                `<option value="${campus.id}">${name}</option>`
            )
        })
    })

    // list programs
    $("#campus").change(function () {
        const campus_id = $(this).val();
        const programs = getAllPrograms(campus_id);
        programs.then((programs) => {
            const {
                data
            } = programs;
            $("#school").addClass('d-none');
            if (data.length > 0) {
                $("#program").html('<option value="">Select Program</option>');
                $("#school").html('');
                $("#program").removeClass('d-none');
                data.map((program) => {
                    const {
                        name,
                        id
                    } = program.attributes.program;
                    $("#program").append(
                        `<option value="${program.id}">${name}</option>`
                    )
                })
            } else {
                $("#program").append(`<option disabled value="">No program available</option>`);
                $("#toast").html(add_notify('Information', 'No program found for this campus at the moment'));
                $("#toast").toast('show');
            }
        })
    })

    // list schools
    $("#program").change(function () {
        const program_id = $(this).val();
        const schools = getAllProgramsSchools(program_id);
        schools.then((schools) => {
            const {
                data
            } = schools;
            $("#school").removeClass('d-none');
            if (data.length > 0) {
                data.map((school, index) => {
                    const {
                        name,
                        id,
                        nomenclature
                    } = school.attributes.school;
                    let nomenclature_name = nomenclature.toLowerCase()
                    if (index === 0) {
                        $("#school").html(`<option value="">Select ${nomenclature_name}</option>`);
                    }
                    $("#school").append(
                        `<option value="${school.id}" school-id="${id}">${name}</option>`
                    )
                })
            } else {
                $("#school").append(`<option disabled value="">No school found for this program</option>`);
                $("#toast").html(add_notify('Information', 'No program found for this campus at the moment'));
                $("#toast").toast('show');
            }
        })
    });

    // list departments
    $("#school").change(function () {
        const school_id = $(this).find(':selected').attr('school-id');
        const departments = getAllDepartments(school_id);
        departments.then((departments) => {
            const {
                data
            } = departments;
            $("#department").removeClass('d-none');
            if (data.length > 0) {
                data.map((department, index) => {
                    const {
                        name,
                        nomenclature,
                        id
                    } = department.attributes;
                    let nomenclature_name = nomenclature.toLowerCase()
                    if (index === 0) {
                        $("#department").html(`<option value="">Select ${nomenclature_name}</option>`);
                    }
                    $("#department").append(
                        `<option value="${department.id}">${name}</option>`
                    )
                })
            } else {
                $("#department").append(`<option disabled value="">No department found</option>`);
                $("#toast").html(add_notify('Information', 'No program found for this campus at the moment'));
                $("#toast").toast('show');
            }
        })
    });

    // list academic year
    $("#department").change(function () {
        const department_id = $(this).val();
        const academic_year = getAcademicYear(department_id);
        academic_year.then((academic_year) => {
            const {
                data
            } = academic_year;
            $("#academic_year").html('<option value="">Select Academic Year</option>');
            $("#academic_year").removeClass('d-none');
            if (data.length > 0) {
                data.map((year) => {
                    const {
                        name,
                        id
                    } = year.attributes.academic_year;
                    $("#academic_year").append(
                        `<option value="${year.id}">${name}</option>`
                    )
                })
            } else {
                $("#academic_year").append(
                    `<option disabled value="">No academic year found</option>`
                )
                $("#toast").html(add_notify('Information', 'No program found for this campus at the moment'));
                $("#toast").toast('show');
            }
        })
    });

    // list academic class
    $("#academic_year").change(function () {
        const academic_year_id = $(this).val();
        const academic_class = getAcademicYearClasses(academic_year_id);
        academic_class.then((academic_class) => {
            const {
                data
            } = academic_class;
            $("#classes").html('<option value="">Select Class</option>');
            $("#classes").removeClass('d-none');
            if (data.length > 0) {
                data.map((classes) => {
                    const {
                        name
                    } = classes.attributes.academic_class;
                    $("#classes").append(
                        `<option value="${classes.id}">${name}</option>`
                    )
                })
            } else {
                $("#classes").append(
                    `<option disabled value="">No class found</option>`
                )
                $("#toast").html(add_notify('Information', 'No program found for this campus at the moment'));
                $("#toast").toast('show');
            }
        })
    });

    // list academic class intake
    $("#classes").change(function () {
        const academic_class_id = $(this).val();
        const academic_class_intake = getAcademicYearClassesIntake(academic_class_id);
        academic_class_intake.then((academic_class_intake) => {
            const {
                data
            } = academic_class_intake;
            $("#intake").html('<option value="">Select Intake</option>');
            $("#intake").removeClass('d-none');
            if (data.length > 0) {
                data.map((intake) => {
                    const {
                        name,
                        end_date
                    } = intake.attributes;
                    $("#intake").append(
                        `<option value="${intake.id}">[${name}] open till ${new Date(end_date)})</option>`
                    )
                })
            } else {
                $("#intake").append(
                    `<option disabled value="">No intake found</option>`
                )
                $("#toast").html(add_notify('Information', 'No program found for this campus at the moment'));
                $("#toast").toast('show');
            }
        })
    });

    // list academic class intake section
    $("#intake").change(function () {
        const academic_class_intake_id = $(this).val();
        const academic_class_intake_section = getAcademicYearClassesIntakeSections(academic_class_intake_id);
        academic_class_intake_section.then((academic_class_intake_section) => {
            const {
                data
            } = academic_class_intake_section;
            $("#section").html('<option value="">Select Section</option>');
            $("#section").removeClass('d-none');
            if (data.length > 0) {
                data.map((section) => {
                    const {
                        name
                    } = section.attributes.academic_section;
                    $("#section").append(
                        `<option value="${section.id}">${name}</option>`
                    )
                })
            } else {
                $("#section").append(
                    `<option disabled value="">No section found</option>`
                )
                $("#toast").html(add_notify('Information', 'No program found for this campus at the moment'));
                $("#toast").toast('show');
            }
        })
    });
});

$("#login_form").submit(function (e) {
    $('#submit').html(`
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `)
    e.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();
    loginUser(email, password).then((response) => {
        if (response.status === 'success') {
            let localStore = window.localStorage;
            localStore.setItem('token', response.token);
            localStore.setItem('user', JSON.stringify(response.data))
            window.location.href = "index.html";
        } else {
            $('#submit').text('Submit')
            $("#toast").html(add_notify('Error', response.error))
            $(".toast").toast("show");
        }
    });
});

$("#register_form").submit(function (e) {
    $('#submit').html(`
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `)
    e.preventDefault();
    const first_name = $("#first_name").val();
    const last_name = $("#last_name").val();
    const email = $("#email").val();
    const password = $("#password").val();
    const password_confirmation = $("#password_confirmation").val();

    registerUser(first_name, last_name, email, password, password_confirmation).then((response) => {
        if (response.status === 'success') {
            $("#toast").html(add_notify('Error', response.message))
            $("#register_form").html(`<h3 class="text-center mt-5 text-success">${response.message}</h3>`)
            $(".toast").toast("show");
        } else {
            $('#submit').text('Submit')
            let errors = response.map((error) => {
                return `<li class="m-0">${error}</li>`
            })
            $("#toast").html(add_notify('Error', errors.join('')))
            $(".toast").toast("show");
        }
    })
});