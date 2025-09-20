-- Insert sample mentor profiles
INSERT INTO public.profiles (id, email, full_name, role, bio, skills, experience_level, location) VALUES
(gen_random_uuid(), 'priya.sharma@example.com', 'Priya Sharma', 'mentor', 'Senior Software Engineer at Google with 8 years of experience in full-stack development and mentoring junior developers.', ARRAY['JavaScript', 'React', 'Node.js', 'Python', 'System Design'], 'senior', 'Bangalore'),
(gen_random_uuid(), 'rajesh.kumar@example.com', 'Rajesh Kumar', 'mentor', 'Data Science Manager at Microsoft, specializing in machine learning and AI solutions for enterprise applications.', ARRAY['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Data Analysis'], 'senior', 'Hyderabad'),
(gen_random_uuid(), 'anita.patel@example.com', 'Anita Patel', 'mentor', 'UX Design Lead at Adobe with expertise in user research, design systems, and product strategy.', ARRAY['UI/UX Design', 'Figma', 'User Research', 'Design Systems', 'Product Strategy'], 'senior', 'Mumbai'),
(gen_random_uuid(), 'vikram.singh@example.com', 'Vikram Singh', 'mentor', 'Digital Marketing Director with 10+ years experience in growth marketing, SEO, and brand strategy.', ARRAY['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Brand Management'], 'senior', 'Delhi'),
(gen_random_uuid(), 'meera.reddy@example.com', 'Meera Reddy', 'mentor', 'Business Analyst at Deloitte, helping organizations optimize processes and drive digital transformation.', ARRAY['Business Analysis', 'Process Optimization', 'SQL', 'Tableau', 'Project Management'], 'intermediate', 'Chennai'),
(gen_random_uuid(), 'arjun.mehta@example.com', 'Arjun Mehta', 'mentor', 'Cybersecurity Consultant with expertise in ethical hacking, security audits, and compliance frameworks.', ARRAY['Cybersecurity', 'Ethical Hacking', 'Network Security', 'Compliance', 'Risk Assessment'], 'senior', 'Pune'),
(gen_random_uuid(), 'kavya.nair@example.com', 'Kavya Nair', 'mentor', 'Product Manager at Flipkart, experienced in e-commerce, product strategy, and agile development.', ARRAY['Product Management', 'Agile', 'Market Research', 'Strategy', 'Leadership'], 'intermediate', 'Bangalore'),
(gen_random_uuid(), 'rohit.gupta@example.com', 'Rohit Gupta', 'mentor', 'Financial Analyst at Goldman Sachs, specializing in investment analysis and financial modeling.', ARRAY['Financial Analysis', 'Investment Banking', 'Excel', 'Financial Modeling', 'Risk Management'], 'senior', 'Mumbai');

-- Insert corresponding mentor details
INSERT INTO public.mentors (id, specialization, years_experience, hourly_rate, availability, languages, rating, total_sessions, is_verified)
SELECT 
  p.id,
  CASE 
    WHEN p.full_name = 'Priya Sharma' THEN ARRAY['Software Development', 'Full Stack', 'Career Transition']
    WHEN p.full_name = 'Rajesh Kumar' THEN ARRAY['Data Science', 'Machine Learning', 'AI Strategy']
    WHEN p.full_name = 'Anita Patel' THEN ARRAY['UX Design', 'Product Design', 'Design Leadership']
    WHEN p.full_name = 'Vikram Singh' THEN ARRAY['Digital Marketing', 'Growth Strategy', 'Brand Building']
    WHEN p.full_name = 'Meera Reddy' THEN ARRAY['Business Analysis', 'Process Improvement', 'Data Analytics']
    WHEN p.full_name = 'Arjun Mehta' THEN ARRAY['Cybersecurity', 'Information Security', 'Compliance']
    WHEN p.full_name = 'Kavya Nair' THEN ARRAY['Product Management', 'E-commerce', 'Strategy']
    WHEN p.full_name = 'Rohit Gupta' THEN ARRAY['Finance', 'Investment Analysis', 'Financial Planning']
  END,
  CASE 
    WHEN p.full_name IN ('Priya Sharma', 'Rajesh Kumar', 'Vikram Singh', 'Arjun Mehta', 'Rohit Gupta') THEN 8 + FLOOR(RANDOM() * 5)
    ELSE 4 + FLOOR(RANDOM() * 4)
  END,
  CASE 
    WHEN p.experience_level = 'senior' THEN 2000 + FLOOR(RANDOM() * 3000)
    ELSE 1000 + FLOOR(RANDOM() * 1500)
  END,
  'Weekdays 6-9 PM, Weekends 10 AM - 6 PM',
  ARRAY['English', 'Hindi'],
  4.0 + (RANDOM() * 1.0),
  FLOOR(RANDOM() * 200) + 50,
  true
FROM public.profiles p
WHERE p.role = 'mentor';
