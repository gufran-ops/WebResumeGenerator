// src/components/ResumePage.js
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ResumePage = () => {
  const location = useLocation();
  const resumeData = location.state?.resumeData || {};

  useEffect(() => {
    // Function to populate the iframe content with resume data
    const populateIframe = () => {
      const iframe = document.getElementById('resumeIframe');
      iframe.onload = () => {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        // Populate fields in the iframe
        iframeDoc.getElementById('fullName').textContent = resumeData.basics.name || 'N/A';
        iframeDoc.getElementById('jobTitle').textContent = "Software Engineer"; 
        iframeDoc.getElementById('email').textContent = resumeData.basics.email;
        iframeDoc.getElementById('email').href = resumeData.basics.email ? `mailto:${resumeData.basics.email}` : '#';
        iframeDoc.getElementById('phone').textContent = resumeData.basics.phone;
        iframeDoc.getElementById('address').textContent = resumeData.basics.address;
        iframeDoc.getElementById('linkedinProfile').href = resumeData.basics.linkedinProfile || '#';
        iframeDoc.getElementById('linkedinProfile').textContent = resumeData.basics.name ? `${resumeData.basics.name}'s LinkedIn` : 'LinkedIn Profile';
        iframeDoc.getElementById('summary').textContent = resumeData.basics.summary ;

        // Work Experience
        const workSection = iframeDoc.getElementById('workExperience');
        const workContent = workSection.querySelector('.sectionContent');
        if (resumeData.work && resumeData.work.length > 0) {
          resumeData.work.forEach(job => {
            const article = document.createElement('article');
            article.style.marginBottom = '10px';
            article.innerHTML = `
              <h2>${job.name}</h2>
              <h3>${job.position}</h3>
              <p class="subDetails">${job.startDate} - ${job.endDate}</p>
              <p>${job.highlights.join('</p><p>')}</p>
            `;
            workContent.appendChild(article);
          });
        } else {
          workSection.remove();
        }

        // Education
        const educationSection = iframeDoc.getElementById('education');
        const educationContent = educationSection.querySelector('.sectionContent');
        if (resumeData.education && resumeData.education.length > 0) {
          resumeData.education.forEach(edu => {
            const article = document.createElement('article');
            article.style.marginBottom = '10px';
            article.innerHTML = `
              <h2>${edu.institution}</h2>
              <h3>${edu.degree}</h3>
              <p class="subDetails">${edu.startDate} - ${edu.endDate}</p>
            `;
            educationContent.appendChild(article);
          });
        } else {
          educationSection.remove();
        }

        // Honors & Awards
        const honorSection = iframeDoc.getElementById('honorAwards');
        const honorContent = honorSection.querySelector('.sectionContent');
        if (resumeData.honor_awards && resumeData.honor_awards.length > 0) {
          resumeData.honor_awards.forEach(award => {
            const p = document.createElement('p');
            p.textContent = award;
            honorContent.appendChild(p);
          });
        } else {
          honorSection.remove();
        }

        // Publications
        const publicationSection = iframeDoc.getElementById('publications');
        const publicationContent = publicationSection.querySelector('.sectionContent');
        if (resumeData.publications && resumeData.publications.length > 0) {
          resumeData.publications.forEach(pub => {
            const p = document.createElement('p');
            p.textContent = pub;
            publicationContent.appendChild(p);
          });
        } else {
          publicationSection.remove();
        }

        // Skills
        const skillsList = iframeDoc.getElementById('skillsList');
        if (resumeData.topSkills && resumeData.topSkills.length > 0) {
          resumeData.topSkills.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill;
            skillsList.appendChild(li);
          });
        } else {
          iframeDoc.getElementById('skills').remove();
        }

        // Languages
        const languagesSection = iframeDoc.getElementById('languages');
        const languagesContent = languagesSection.querySelector('.sectionContent');
        if (resumeData.languages && resumeData.languages.length > 0) {
          resumeData.languages.forEach(lang => {
            const p = document.createElement('p');
            p.textContent = `${lang.language}: ${lang.fluency}`;
            languagesContent.appendChild(p);
          });
        } else {
          languagesSection.remove();
        }

        // Certifications
        const certificationSection = iframeDoc.getElementById('certifications');
        const certificationContent = certificationSection.querySelector('.sectionContent');
        if (resumeData.certifications && resumeData.certifications.length > 0) {
          resumeData.certifications.forEach(cert => {
            const p = document.createElement('p');
            p.textContent = cert;
            certificationContent.appendChild(p);
          });
        } else {
          certificationSection.remove();
        }
      };
    };

    // Trigger the iframe population function after component mounts
    populateIframe();
  }, [resumeData]);

  return (
    <div>
      <iframe
        id="resumeIframe"
        src="/resume.html"
        style={{ width: '100%', height: '100vh' }}
        title="Resume"
      />
    </div>
  );
};

export default ResumePage;
