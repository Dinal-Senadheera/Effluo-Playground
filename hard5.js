import Course from '../models/CourseModel.js';
import Faculty from '../models/FacultyModel.js';

const createCourse = async (req, res) => {
  const { code, name, description, credits, facultyCode } = req.body;
  try {
    if (!code || !name || !credits) {
      throw Error('Course must have a Code, Name and Credits');
    }
    const exists = await Course.findOne({ code });
    if (exists) {
      return res.status(400).json({ error: 'Course already exists' });
    }

    let credit = credits;
    // convert the credits to numbers
    try {
      if (typeof credits === 'string') {
        credit = parseInt(credits);
      }
    } catch (e) {
      return res.status(400).json({ error: 'Invalid credits' });
    }

    const course = new Course({ code, name, description, credits: credit });

    if (facultyCode !== undefined) {
      const faculty = await Faculty.findOne({ code: facultyCode });
      if (!faculty) {
        return res.status(404).json({ error: 'Associated Faculty not found' });
      }
      course.facultyCodes = facultyCode;
      course.facultyIds = faculty._id;
    }

    await course.save();
    res.status(200).json({ course });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const updateCourse = async (req, res) => {
  const { code, newCode, name, description, credits, facultyCodes } = req.body;
  try {
    if (
      !code &&
      (!newCode || !name || !credits || !facultyCodes || !description)
    ) {
      throw Error(
        'code && (newCode || name || credits || description || facultyCodes) are required'
      );
    }
    const course = await Course.findOne({ code });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    let credit = credits;
    // convert the credits to numbers
    try {
      if (typeof credits === 'string') {
        credit = parseInt(credits);
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: 'Invalid credits' });
    }

    course.code = newCode ?? code;
    course.name = name ?? course.name;
    course.description = description ?? course.description;
    course.credits = credit ?? course.credits;

    if (facultyCodes !== undefined && facultyCodes.length > 0) {
      let objectIds = [];
      for (const facultyCode of facultyCodes) {
        const faculty = await Faculty.findOne({ code: facultyCode });
        if (!faculty) {
          return res.status(404).json({
            error: `Associated Faculty not found for code : ${facultyCode}`,
          });
        }
        objectIds.push(faculty._id);
      }
      course.facultyCodes = facultyCodes;
      course.facultyIds = objectIds;
    }

    await course.save();
    res.status(200).json({ course });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  const { code } = req.body;
  try {
    const course = await Course.findOneAndDelete({ code });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    return res.status(200).json({ course });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const getACourse = async (req, res) => {
  const { code } = req.params;
  try {
    const course = await Course.findOne({ code });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    return res.status(200).json({ course });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const getAllCourses = async (_, res) => {
  try {
    const courses = await Course.find();
    if (!courses) {
      return res.status(404).json({ error: 'Courses not found' });
    }
    return res.status(200).json({ courses });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const attachFaculty = async (req, res) => {
  const { code, facultyCode } = req.body;
  try {
    if (!facultyCode || !code) {
      throw Error('Course code and Faculty code are required');
    }
    const course = await Course.findOne({ code });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    if (course.facultyCodes.includes(facultyCode)) {
      return res
        .status(400)
        .json({ error: 'Faculty already attached to course' });
    }
    const faculty = await Faculty.findOne({ code: facultyCode });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    course.facultyCodes.push(facultyCode);
    course.facultyIds.push(faculty._id);
    await course.save();
    res.status(200).json({ course });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const detachFaculty = async (req, res) => {
  const { code, facultyCode } = req.body;
  try {
    if (!facultyCode || !code) {
      throw Error('Course code and Faculty code are required');
    }
    const course = await Course.findOne({ code });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const faculty = await Faculty.findOne({ code: facultyCode });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    course.facultyCodes = course.facultyCodes.filter(
      (code) => code !== facultyCode
    );
    course.facultyIds = course.facultyIds.filter(
      (id) => id.toString() !== faculty._id.toString()
    );
    await course.save();
    res.status(200).json({ course });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export {
  createCourse,
  updateCourse,
  deleteCourse,
  getACourse,
  getAllCourses,
  attachFaculty,
  detachFaculty,
};
