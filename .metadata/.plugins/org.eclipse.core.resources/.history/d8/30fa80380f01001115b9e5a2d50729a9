package com.example.services;
import java.util.List;
import java.util.Optional;

import com.example.entities.Course;



public interface CourseService {
    Optional<Course> getCourseById(int courseId);
    List<Course> getAllCourses();
    Course addCourse(Course course);
    Course updateCourse(Course course,int courseId);
    Optional<Course> findCourseByName(String courseName);
    void deleteCourse(int courseId);
}