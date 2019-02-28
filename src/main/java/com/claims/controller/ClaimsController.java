package com.claims.controller;

import com.claims.model.Information;
import com.claims.model.Result;
import com.claims.repository.InformationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletResponse;
import java.net.URI;

@RestController
public class ClaimsController {

    private static final Logger logger = LoggerFactory.getLogger(ClaimsController.class);

    @Autowired
    private InformationRepository informationRepository;

    @GetMapping("/")
    public void welcomePage(HttpServletResponse httpServletResponse) {
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path(
                "/test.html").buildAndExpand().toUri();
        httpServletResponse.setHeader("Location", uri.toString());
        httpServletResponse.setStatus(302);
    }

    @GetMapping("/test")
    public String testService() {
        return "success";
    }

    @RequestMapping(value = "/info/save", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<?> saveInfo(@RequestBody Information info) {
        try {
            logger.info("Saving info");
            informationRepository.save(info);
            return new ResponseEntity<>("Saved info", HttpStatus.OK);
        } catch (Exception ex) {
            String errorMessage;
            errorMessage = ex + " <== error";
            return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> getInfo(@PathVariable Long id) {
        try {
            logger.info("Getting info {}", id);
            return new ResponseEntity<>(informationRepository.findById(id), HttpStatus.OK);
        } catch (Exception ex) {
            String errorMessage;
            errorMessage = ex + " <== error";
            return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/info/all", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> getAllInfo() {
        try {
            logger.info("Getting all info");
            return new ResponseEntity<>(informationRepository.findAll(), HttpStatus.OK);
        } catch (Exception ex) {
            String errorMessage;
            errorMessage = ex + " <== error";
            return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<?> getClaimsInfo(@PathVariable String id) {
        try {
            logger.info("Getting claims info {}", id);
            long infoId;
            if (id.equals("dashboard")) {
                infoId = 1;
            } else if (id.equals("incidents")) {
                infoId = 2;
            } else if (id.equals("customers")) {
                infoId = 3;
            } else if (id.equals("about")) {
                infoId = 4;
            } else {
                throw new Exception("Invalid info");
            }
            return new ResponseEntity<>(informationRepository.findById(infoId), HttpStatus.OK);
        } catch (Exception ex) {
            String errorMessage = ex + " <== error";
            return new ResponseEntity<>(new Result(errorMessage), HttpStatus.BAD_REQUEST);
        }
    }

    //Reference
/*    @PostMapping("/students/{studentId}/courses")
    public ResponseEntity<Void> registerStudentForCourse(
            @PathVariable String studentId, @RequestBody Course newCourse) {

        if (course == null)
            return ResponseEntity.noContent().build();

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path(
                "/{id}").buildAndExpand(course.getId()).toUri();

        return ResponseEntity.created(location).build();
    }*/


}
