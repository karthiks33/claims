package com.claims.controller;

import java.net.URI;
import java.util.List;

import com.claims.model.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.claims.service.StudentService;

import javax.servlet.http.HttpServletResponse;

@RestController
public class ClaimsController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/")
    public void welcomePage(HttpServletResponse httpServletResponse){
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path(
                "/test.html").buildAndExpand().toUri();
        httpServletResponse.setHeader("Location", uri.toString());
        httpServletResponse.setStatus(302);
    }

    @GetMapping("/test")
    public String testService() {
        return "success";
    }

    @GetMapping("/students/{studentId}/courses")
    public List<Course> retrieveCoursesForStudent(@PathVariable String studentId) {
        return studentService.retrieveCourses(studentId);
    }

    @PostMapping("/students/{studentId}/courses")
    public ResponseEntity<Void> registerStudentForCourse(
            @PathVariable String studentId, @RequestBody Course newCourse) {

        Course course = studentService.addCourse(studentId, newCourse);

        if (course == null)
            return ResponseEntity.noContent().build();

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path(
                "/{id}").buildAndExpand(course.getId()).toUri();

        return ResponseEntity.created(location).build();
    }

    @GetMapping("/students/{studentId}/courses/{courseId}")
    public Course retrieveDetailsForCourse(@PathVariable String studentId,
                                           @PathVariable String courseId) {
        return studentService.retrieveCourse(studentId, courseId);
    }

}
