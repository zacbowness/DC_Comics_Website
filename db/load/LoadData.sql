PRAGMA foreign_keys = ON;


INSERT INTO User (user_name, password, email, first_name, last_name, DOB)
VALUES
('spideyfan67','spidersR!1', 'findme@help.com', 'spider', 'man' ,'10 Aug 2001' )
;

INSERT INTO Grade_Company (grade_company, grade_company_title,grade_company_description)
VALUES
(
    'CGC' , 'Certified Guaranty Company' , 
    'CGC is the most widely recognized and respected comic book 
    grading company in the industry. Their grading scale ranges from 0.5 to 10.0, with 10.0 being considered 
    in perfect condition. They use a team of expert graders to assign grades, 
    and they also encapsulate comics in tamper-evident plastic cases to preserve and protect them.'
),
(
    'PGX' , 'Professional Grading eXperts' , 
    'PGX is a smaller grading company compared to CGC and CBCS but still offers professional comic book grading services. 
    They use a similar grading scale and provide a certification of authenticity for each comic they grade.'
),
(
    'HCG' , 'Hero Certification Services' , 
    'HCG is a lesser-known comic book grading company that provides grading and certification services for comic books. 
    Their grading scale is similar to CGC’s, and they focus on high-quality grading services.'
),
(
    'ICG' , 'International Comic Guaranty' , 
    'ICG is another grading company that offers services for comic books. They are less prominent than CGC or CBCS, 
    but they are still an option for collectors. 
    They use a similar grading system and focus on providing accurate assessments of a comic’s condition.'
),
(
    'BGS' , 'Beckett Grading Services' , 
    'While Beckett is best known for grading sports cards, they also offer comic book grading services.
     Their comic grading is a newer offering, but Beckett is a trusted name in grading collectibles.'
);

INSERT INTO User_comic_list (list_name, user_name)
VALUES
('123','spideyfan67');

