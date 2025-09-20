-- Insert sample curriculum data
INSERT INTO public.curriculum (title, description, field, level, duration_weeks, skills_covered, prerequisites, career_outcomes) VALUES
('Full Stack Web Development', 'Complete web development course covering frontend and backend technologies', 'Technology', 'beginner', 16, 
 ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Database Design'], 
 ARRAY['Basic computer skills'], 
 ARRAY['Frontend Developer', 'Backend Developer', 'Full Stack Developer']),

('Data Science Fundamentals', 'Introduction to data science, analytics, and machine learning', 'Data Science', 'beginner', 12,
 ARRAY['Python', 'Statistics', 'Data Visualization', 'Machine Learning', 'SQL'],
 ARRAY['Basic mathematics', 'Programming basics'],
 ARRAY['Data Analyst', 'Data Scientist', 'Business Intelligence Analyst']),

('Digital Marketing Mastery', 'Comprehensive digital marketing strategies and tools', 'Marketing', 'intermediate', 8,
 ARRAY['SEO', 'Social Media Marketing', 'Content Marketing', 'PPC', 'Analytics'],
 ARRAY['Basic marketing knowledge'],
 ARRAY['Digital Marketing Manager', 'SEO Specialist', 'Social Media Manager']),

('UX/UI Design Bootcamp', 'User experience and interface design principles and tools', 'Design', 'beginner', 10,
 ARRAY['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
 ARRAY['Basic design sense'],
 ARRAY['UX Designer', 'UI Designer', 'Product Designer']),

('Business Analytics', 'Business intelligence and data-driven decision making', 'Business', 'intermediate', 6,
 ARRAY['Excel', 'Power BI', 'SQL', 'Business Intelligence', 'Data Visualization'],
 ARRAY['Basic business knowledge'],
 ARRAY['Business Analyst', 'Operations Analyst', 'Strategy Consultant']),

('Cybersecurity Essentials', 'Fundamentals of cybersecurity and information protection', 'Technology', 'intermediate', 14,
 ARRAY['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Compliance'],
 ARRAY['Basic networking knowledge'],
 ARRAY['Security Analyst', 'Cybersecurity Specialist', 'IT Security Manager']),

('Project Management Professional', 'Comprehensive project management methodologies and tools', 'Management', 'intermediate', 8,
 ARRAY['Agile', 'Scrum', 'Risk Management', 'Stakeholder Management', 'Project Planning'],
 ARRAY['Work experience'],
 ARRAY['Project Manager', 'Scrum Master', 'Program Manager']),

('Financial Analysis & Modeling', 'Financial analysis techniques and modeling skills', 'Finance', 'advanced', 10,
 ARRAY['Financial Modeling', 'Valuation', 'Excel', 'Financial Analysis', 'Investment Analysis'],
 ARRAY['Finance background', 'Advanced Excel'],
 ARRAY['Financial Analyst', 'Investment Banker', 'Corporate Finance Manager']);
