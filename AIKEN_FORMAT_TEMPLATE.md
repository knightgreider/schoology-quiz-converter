# Aiken Format Template for AI Quiz Generation

Use this template when asking AI systems to generate quiz questions for import into the Schoology Quiz Converter.

## Format Instructions for AI

Please generate quiz questions using the Aiken format with the following specifications:

### Basic Structure
- Each question starts with a type prefix followed by "::" and the question text
- Answer choices are listed one per line, each starting with "~"
- Mark the correct answer with "*~" instead of just "~"
- Separate each question with a blank line

### Question Types Available

**Multiple Choice (MC::**
```
MC:: What is the capital of France?
~Berlin
~Madrid
*~Paris
~Rome
```

**True/False (TF::**
```
TF:: The Earth is flat.
~True
*~False
```

**Essay Questions (ESSAY:: or ES::**
```
ESSAY:: Explain the process of photosynthesis and its importance to life on Earth.
```

**Matching Questions (MT::**
```
MT:: Match each country with its capital city.
~France => Paris
~Germany => Berlin
~Spain => Madrid
~Italy => Rome
```

### Special Modifiers

**For questions with images ([IMG]):**
```
MC[IMG]:: What type of animal is shown in this image?
~Reptile
~Bird
*~Mammal
~Fish
```

**For randomized multiple choice ([RAND]):**
```
MC[RAND]:: Which of these is a prime number?
~4
~6
*~7
~9
```

**Combined modifiers:**
```
MC[IMG][RAND]:: What geological formation is depicted in this photograph?
~Volcano
*~Canyon
~Glacier
~Desert
```

## Sample Prompt for AI Systems

"Please create 10 quiz questions about [TOPIC] using the Aiken format. Follow these requirements:

1. Use the exact format shown with MC::, TF::, ESSAY::, or MT:: prefixes
2. For multiple choice, provide 4 answer options each
3. Mark correct answers with *~ (asterisk followed by tilde)
4. Include a mix of question types
5. Add [RAND] to multiple choice questions where answer randomization would be beneficial
6. Separate each question with a blank line
7. Make questions appropriate for [GRADE LEVEL/AUDIENCE]

Example format:
MC:: Question text here?
~Wrong answer
~Wrong answer  
*~Correct answer
~Wrong answer

TF:: True or false question?
~True
*~False

ESSAY:: Essay question requiring detailed explanation.

Ensure all questions are factually accurate and educationally valuable."

## Best Practices for AI-Generated Content

### Question Quality Guidelines
- Questions should test understanding, not just memorization
- Avoid overly obvious or trick questions
- Use clear, unambiguous language
- Ensure all answer choices are plausible
- Vary question difficulty appropriately

### Content Considerations
- Keep questions focused on key learning objectives
- Use academic language appropriate for the target audience
- Avoid cultural bias or references that may not be universally understood
- Include real-world applications when relevant

### Technical Notes
- The system supports Unicode characters for special symbols
- Line breaks must be consistent (use standard line endings)
- Avoid using special characters in question IDs or titles
- Images should be uploaded separately through the web interface

## Copy-Paste Ready Prompt

```
Create quiz questions using Aiken format for [SUBJECT/TOPIC]. Use this exact structure:

MC:: [Question text]?
~[Wrong option]
~[Wrong option]
*~[Correct option]
~[Wrong option]

TF:: [True/false statement].
~True
*~False

ESSAY:: [Open-ended question requiring explanation].

Requirements:
- 4 answer choices for MC questions
- Mark correct answers with *~
- Add [RAND] for randomizable MC questions
- Separate questions with blank lines
- Make content appropriate for [GRADE LEVEL]
- Focus on [SPECIFIC LEARNING OBJECTIVES]

Generate [NUMBER] questions total with a mix of MC, TF, and ESSAY types.
```

---

*This template ensures compatibility with the Schoology Quiz Converter and produces properly formatted .imscc files for LMS import.*