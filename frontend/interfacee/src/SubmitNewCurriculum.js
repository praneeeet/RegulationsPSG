import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

const SubmitNewCurriculum = () => {
  const [formData, setFormData] = useState({
    department: '',
    course: '',
    regulationYear: '',
    totalCredits: '',
    semesters: 1,
    selectedSemester: 1,
    courses: Array(1).fill([]),
    savedSemesters: new Set(),
    currentStage: 1,
  });

  const departments = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'];
  const courses = {
    'Computer Science': ['B.Tech', 'M.Tech', 'Ph.D'],
    'Electrical Engineering': ['B.Tech', 'M.Tech'],
    'Mechanical Engineering': ['B.Tech'],
    'Civil Engineering': ['B.Tech', 'M.Tech'],
  };
  const semesterOptions = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'department') {
        return { ...prev, department: value, course: '' };
      }
      if (name === 'semesters' && prev.currentStage === 1) {
        const num = parseInt(value);
        return {
          ...prev,
          semesters: num,
          courses: Array(num).fill([]),
          selectedSemester: 1,
          savedSemesters: new Set(),
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleAddCourse = () => {
    const newCourse = {
      code: '',
      name: '',
      credits: '',
      lHours: '',
      tHours: '',
      pHours: '',
      caMarks: '',
      feMarks: '',
      totalMarks: '',
      isExpanded: true,
    };
    setFormData((prev) => {
      const updatedCourses = [...prev.courses];
      updatedCourses[prev.selectedSemester - 1] = [...(updatedCourses[prev.selectedSemester - 1] || []), newCourse];
      return { ...prev, courses: updatedCourses };
    });
  };

  const handleCourseChange = (semesterIndex, courseIndex, field, value) => {
    setFormData((prev) => {
      const updatedCourses = [...prev.courses];
      updatedCourses[semesterIndex] = updatedCourses[semesterIndex].map((course, idx) =>
        idx === courseIndex ? { ...course, [field]: value } : course
      );
      return { ...prev, courses: updatedCourses };
    });
  };

  const handleToggleExpand = (semesterIndex, courseIndex) => {
    setFormData((prev) => {
      const updatedCourses = [...prev.courses];
      updatedCourses[semesterIndex] = updatedCourses[semesterIndex].map((course, idx) =>
        idx === courseIndex ? { ...course, isExpanded: !course.isExpanded } : course
      );
      return { ...prev, courses: updatedCourses };
    });
  };

  const handleDeleteCourse = (semesterIndex, courseIndex) => {
    setFormData((prev) => {
      const updatedCourses = [...prev.courses];
      updatedCourses[semesterIndex] = updatedCourses[semesterIndex].filter((_, idx) => idx !== courseIndex);
      return { ...prev, courses: updatedCourses };
    });
    toast.success('Course deleted successfully!', {
      position: 'top-right',
      autoClose: 2000,
    });
  };

  const handleSemesterSelect = (semester) => {
    setFormData((prev) => ({ ...prev, selectedSemester: semester }));
  };

  const handleSaveSemester = (semesterIndex) => {
    const semesterCourses = formData.courses[semesterIndex];
    if (
      semesterCourses.length > 0 &&
      semesterCourses.every(
        (course) =>
          course.code.trim() &&
          course.name.trim() &&
          course.credits &&
          course.lHours !== '' &&
          course.tHours !== '' &&
          course.pHours !== '' &&
          course.caMarks !== '' &&
          course.feMarks !== '' &&
          course.totalMarks !== ''
      )
    ) {
      setFormData((prev) => {
        const newSavedSemesters = new Set(prev.savedSemesters);
        newSavedSemesters.add(semesterIndex + 1);
        return { ...prev, savedSemesters: newSavedSemesters };
      });
      toast.success(`Semester ${semesterIndex + 1} saved successfully!`, {
        position: 'top-right',
        autoClose: 2000,
      });
    } else {
      toast.error('Please fill all course details for this semester.', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  const isStageComplete = (stage) => {
    if (stage === 1) {
      return (
        formData.department &&
        formData.course &&
        formData.regulationYear &&
        formData.totalCredits &&
        formData.semesters > 0
      );
    }
    if (stage === 2) {
      return formData.savedSemesters.size === formData.semesters;
    }
    return true;
  };

  const nextStage = () => {
    if (isStageComplete(formData.currentStage)) {
      setFormData((prev) => ({ ...prev, currentStage: prev.currentStage + 1 }));
    } else {
      toast.error(`Please complete Stage ${formData.currentStage} before proceeding.`, {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  const prevStage = () => {
    setFormData((prev) => ({ ...prev, currentStage: prev.currentStage - 1 }));
  };

  const generateDOCX = () => {
    const courseName = formData.course.toUpperCase().replace(/\./g, '');
    const docName = `${courseName}-${formData.regulationYear} Regulations.docx`;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "13. COURSES OF STUDY AND SCHEME OF ASSESSMENT",
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: courseName,
                  bold: true,
                }),
                new TextRun({
                  text: `(${formData.regulationYear} REGULATIONS)`,
                  bold: true,
                }).break(),
              ],
              alignment: AlignmentType.BOTH,
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `(TOTAL CREDITS TO BE EARNED: ${formData.totalCredits}*)`,
                }),
              ],
              spacing: { after: 400 },
            }),
            ...formData.courses.flatMap((semCourses, semIndex) => {
              const semesterNumber = semIndex + 1;
              let totalCredits = 0, totalL = 0, totalT = 0, totalP = 0, totalCA = 0, totalFE = 0, totalMarks = 0;

              semCourses.forEach((course) => {
                totalCredits += parseInt(course.credits) || 0;
                totalL += parseInt(course.lHours) || 0;
                totalT += parseInt(course.tHours) || 0;
                totalP += parseInt(course.pHours) || 0;
                totalCA += parseInt(course.caMarks) || 0;
                totalFE += parseInt(course.feMarks) || 0;
                totalMarks += parseInt(course.totalMarks) || 0;
              });

              const table = new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ text: "Course Code", bold: true, alignment: AlignmentType.CENTER })],
                        width: { size: 10, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: "Course Title", bold: true, alignment: AlignmentType.CENTER })],
                        width: { size: 30, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: "C", bold: true, alignment: AlignmentType.CENTER })],
                        width: { size: 5, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: "L", bold: true, alignment: AlignmentType.CENTER })],
                        width: { size: 5, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: "T", bold: true, alignment: AlignmentType.CENTER })],
                        width: { size: 5, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: "P", bold: true, alignment: AlignmentType.CENTER })],
                        width: { size: 5, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: "CA", bold: true, alignment: AlignmentType.CENTER })],
                        width: { size: 5, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: "FE", bold: true, alignment: AlignmentType.CENTER })],
                        width: { size: 5, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: "Total", bold: true, alignment: AlignmentType.CENTER })],
                        width: { size: 5, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                    ],
                  }),
                  ...semCourses.map((course) => new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ text: course.code, alignment: AlignmentType.CENTER })],
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: course.name, alignment: AlignmentType.LEFT })],
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: course.credits, alignment: AlignmentType.CENTER })],
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: course.lHours, alignment: AlignmentType.CENTER })],
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: course.tHours, alignment: AlignmentType.CENTER })],
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: course.pHours, alignment: AlignmentType.CENTER })],
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: course.caMarks, alignment: AlignmentType.CENTER })],
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: course.feMarks, alignment: AlignmentType.CENTER })],
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: course.totalMarks, alignment: AlignmentType.CENTER })],
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                    ],
                  })),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ text: "TOTAL", bold: true, alignment: AlignmentType.CENTER })],
                        columnSpan: 2,
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: totalCredits.toString(), bold: true, alignment: AlignmentType.CENTER })],
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: totalL.toString(), bold: true, alignment: AlignmentType.CENTER })],
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: totalT.toString(), bold: true, alignment: AlignmentType.CENTER })],
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: totalP.toString(), bold: true, alignment: AlignmentType.CENTER })],
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: totalCA.toString(), bold: true, alignment: AlignmentType.CENTER })],
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: totalFE.toString(), bold: true, alignment: AlignmentType.CENTER })],
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: totalMarks.toString(), bold: true, alignment: AlignmentType.CENTER })],
                        borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                      }),
                    ],
                  }),
                ],
              });

              return [
                new Paragraph({
                  children: [new TextRun({ text: `SEMESTER ${semesterNumber}`, bold: true, size: 20 })],
                  spacing: { before: 400, after: 200 },
                }),
                table,
                new Paragraph({
                  children: [
                    new TextRun({ text: "ABBREVIATIONS:", bold: true, size: 18 }),
                    new TextRun({ text: " C - Credits, L - Lecture Hours/Week, T - Tutorial Hours/Week, P - Practical Hours/Week, CA - Continuous Assessment Marks, FE - Final Exam Marks, Total - Total Marks" }),
                  ],
                  spacing: { before: 200, after: 400 },
                }),
                new Paragraph({ children: [], pageBreakBefore: true }),
              ];
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, docName);
      toast.success(
        `DOCX generated successfully! File downloaded as ${docName}.`,
        {
          position: 'top-right',
          autoClose: 5000,
        }
      );
    }).catch((error) => {
      console.error("Error generating DOCX:", error);
      toast.error('Failed to generate DOCX. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
      });
    });

    return docName;
  };

  const handleGenerateDOCX = () => {
    if (isStageComplete(2)) {
      const docName = generateDOCX();
      console.log(`DOCX generated: ${docName}`);
    } else {
      toast.error('Please complete all semesters before generating DOCX.', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="content-section">
      <h1 className="section-title">Submit New Curriculum</h1>
      <div className="submit-container">
        <div className="progress-bar">
          <div className={`progress-step ${formData.currentStage >= 1 ? 'active' : ''}`}>1. Course Details</div>
          <div className={`progress-step ${formData.currentStage >= 2 ? 'active' : ''}`}>2. Semester Details</div>
          <div className={`progress-step ${formData.currentStage >= 3 ? 'active' : ''}`}>3. Generate DOCX</div>
        </div>
        {formData.currentStage === 1 && (
          <div className="stage-content">
            <h2 className="content-subtitle">Stage 1: Course Details</h2>
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="course">Course</label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                className="form-select"
                disabled={!formData.department}
              >
                <option value="">Select Course</option>
                {formData.department &&
                  courses[formData.department]?.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="regulationYear">Regulation Year</label>
              <input
                id="regulationYear"
                name="regulationYear"
                type="number"
                value={formData.regulationYear}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., 2023"
              />
            </div>
            <div className="form-group">
              <label htmlFor="totalCredits">Total Credits to be Earned</label>
              <input
                id="totalCredits"
                name="totalCredits"
                type="number"
                value={formData.totalCredits}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., 212"
              />
            </div>
            <div className="form-group">
              <label htmlFor="semesters">Number of Semesters</label>
              <select
                id="semesters"
                name="semesters"
                value={formData.semesters}
                onChange={handleInputChange}
                className="form-select"
              >
                {semesterOptions.map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <button className="nav-button" onClick={nextStage} disabled={!isStageComplete(1)}>
              Next
            </button>
          </div>
        )}
        {formData.currentStage === 2 && (
          <div className="stage-content">
            <h2 className="content-subtitle">Stage 2: Semester Details</h2>
            <div className="semester-tabs">
              {Array.from({ length: formData.semesters }, (_, i) => i + 1).map((sem) => (
                <button
                  key={sem}
                  className={`semester-tab ${formData.selectedSemester === sem ? 'active' : ''}`}
                  onClick={() => handleSemesterSelect(sem)}
                >
                  Semester {sem} {formData.savedSemesters.has(sem) && '(Saved)'}
                </button>
              ))}
            </div>
            <div className="courses-container">
              {formData.courses[formData.selectedSemester - 1]?.map((course, courseIndex) => (
                <div key={courseIndex} className="course-entry">
                  <div
                    className="course-summary"
                    onClick={() => handleToggleExpand(formData.selectedSemester - 1, courseIndex)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && handleToggleExpand(formData.selectedSemester - 1, courseIndex)}
                  >
                    <span>
                      {course.code && course.name
                        ? `${course.code} : ${course.name}`
                        : `Course ${courseIndex + 1}`}
                    </span>
                    <span>{course.isExpanded ? <FaChevronUp /> : <FaChevronDown />}</span>
                  </div>
                  {course.isExpanded && (
                    <div className="course-details">
                      <div className="course-row">
                        <div className="form-group">
                          <label htmlFor={`code-${courseIndex}`}>Course Code</label>
                          <input
                            id={`code-${courseIndex}`}
                            type="text"
                            value={course.code}
                            onChange={(e) => handleCourseChange(formData.selectedSemester - 1, courseIndex, 'code', e.target.value)}
                            className="form-input"
                            placeholder="e.g., CS101"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor={`name-${courseIndex}`}>Course Name</label>
                          <input
                            id={`name-${courseIndex}`}
                            type="text"
                            value={course.name}
                            onChange={(e) => handleCourseChange(formData.selectedSemester - 1, courseIndex, 'name', e.target.value)}
                            className="form-input"
                            placeholder="e.g., Introduction to Programming"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor={`credits-${courseIndex}`}>Credits</label>
                          <input
                            id={`credits-${courseIndex}`}
                            type="number"
                            min="1"
                            value={course.credits}
                            onChange={(e) => handleCourseChange(formData.selectedSemester - 1, courseIndex, 'credits', e.target.value)}
                            className="form-input"
                            placeholder="e.g., 3"
                          />
                        </div>
                      </div>
                      <div className="course-row">
                        <div className="form-group">
                          <label htmlFor={`lHours-${courseIndex}`}>L Hours/Week</label>
                          <input
                            id={`lHours-${courseIndex}`}
                            type="number"
                            min="0"
                            value={course.lHours}
                            onChange={(e) => handleCourseChange(formData.selectedSemester - 1, courseIndex, 'lHours', e.target.value)}
                            className="form-input"
                            placeholder="e.g., 3"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor={`tHours-${courseIndex}`}>T Hours/Week</label>
                          <input
                            id={`tHours-${courseIndex}`}
                            type="number"
                            min="0"
                            value={course.tHours}
                            onChange={(e) => handleCourseChange(formData.selectedSemester - 1, courseIndex, 'tHours', e.target.value)}
                            className="form-input"
                            placeholder="e.g., 1"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor={`pHours-${courseIndex}`}>P Hours/Week</label>
                          <input
                            id={`pHours-${courseIndex}`}
                            type="number"
                            min="0"
                            value={course.pHours}
                            onChange={(e) => handleCourseChange(formData.selectedSemester - 1, courseIndex, 'pHours', e.target.value)}
                            className="form-input"
                            placeholder="e.g., 2"
                          />
                        </div>
                      </div>
                      <div className="course-row">
                        <div className="form-group">
                          <label htmlFor={`caMarks-${courseIndex}`}>CA Marks</label>
                          <input
                            id={`caMarks-${courseIndex}`}
                            type="number"
                            min="0"
                            value={course.caMarks}
                            onChange={(e) => handleCourseChange(formData.selectedSemester - 1, courseIndex, 'caMarks', e.target.value)}
                            className="form-input"
                            placeholder="e.g., 40"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor={`feMarks-${courseIndex}`}>FE Marks</label>
                          <input
                            id={`feMarks-${courseIndex}`}
                            type="number"
                            min="0"
                            value={course.feMarks}
                            onChange={(e) => handleCourseChange(formData.selectedSemester - 1, courseIndex, 'feMarks', e.target.value)}
                            className="form-input"
                            placeholder="e.g., 60"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor={`totalMarks-${courseIndex}`}>Total Marks</label>
                          <input
                            id={`totalMarks-${courseIndex}`}
                            type="number"
                            min="0"
                            value={course.totalMarks}
                            onChange={(e) => handleCourseChange(formData.selectedSemester - 1, courseIndex, 'totalMarks', e.target.value)}
                            className="form-input"
                            placeholder="e.g., 100"
                          />
                        </div>
                      </div>
                      <button
                        className="delete-course-button"
                        onClick={() => handleDeleteCourse(formData.selectedSemester - 1, courseIndex)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button className="add-course-button" onClick={handleAddCourse}>
                Add Course
              </button>
              <button
                className="save-semester-button"
                onClick={() => handleSaveSemester(formData.selectedSemester - 1)}
                disabled={formData.savedSemesters.has(formData.selectedSemester)}
              >
                Save Semester {formData.selectedSemester}
              </button>
            </div>
            <div className="nav-buttons">
              <button className="nav-button" onClick={prevStage}>
                Back
              </button>
              <button className="nav-button" onClick={nextStage} disabled={!isStageComplete(2)}>
                Next
              </button>
            </div>
          </div>
        )}
        {formData.currentStage === 3 && (
          <div className="stage-content">
            <h2 className="content-subtitle">Stage 3: Generate DOCX</h2>
            <p className="section-content">All semesters are complete. Click the button below to generate and download the DOCX file.</p>
            <button className="generate-pdf-button" onClick={handleGenerateDOCX}>
              Generate DOCX
            </button>
            <button className="nav-button" onClick={prevStage}>
              Back
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SubmitNewCurriculum;