const questions = document.querySelectorAll('.question');
const progress = document.querySelector('.progress');
let currentIndex = 0;
const answers = {username:"mohamed"};

// عنصر اختيار اللغة
const languageSelect = document.getElementById('language');

// عرض السؤال الحالي
function showQuestion(index) {
    questions.forEach(q => q.classList.remove('active'));
    questions[index].classList.add('active');
    progress.style.width = `${((index + 1) / questions.length) * 100}%`;
}

// التحقق من صحة المدخلات
function validateInput(input) {
    if (!input) return true;
    const value = input.value.trim();
    if (value === '') return false;
    if (input.type === 'number' && Number(value) <= 0) return false;
    return true;
}

// زر Next
document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const parent = btn.closest('.question');
        const input = parent.querySelector('input');
        const questionText = parent.querySelector('label, h3, h4').innerText || 'Question ' + (currentIndex + 1);

        if (!validateInput(input)) {
            alert(languageSelect.value === 'ar' ? 'من فضلك أدخل قيمة صحيحة!' : 'Please enter a valid value!');
            return;
        }

        if (input && input.value.trim() !== '') answers[questionText] = input.value.trim();

        currentIndex++;
        if (currentIndex < questions.length) showQuestion(currentIndex);
        else sendSurveyData();
    });
});

// خيارات الأسئلة (button)
document.querySelectorAll('.options button').forEach(btn => {
    btn.addEventListener('click', () => {
        const parent = btn.closest('.question');
        const input = parent.querySelector('input');
        const questionText = parent.querySelector('label, h3, h4').innerText || 'Question ' + (currentIndex + 1);

        if (input && input.value.trim() !== '') {
            answers[questionText] = input.value.trim();
        } else {
            answers[questionText] = btn.dataset.value;
        }

        currentIndex++;
        if (currentIndex < questions.length) showQuestion(currentIndex);
        else sendSurveyData();
    });
});

// إرسال البيانات لسيرفر Node.js
async function sendSurveyData() {
    console.log("📩 إرسال البيانات إلى السيرفر:", answers);

    try {
        const response = await fetch("https://gazar-zeta.vercel.app/api/survey", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(answers) 
        });

        const data = await response.json();
        console.log("📥 رد السيرفر:", data);

        if (data.success) {
            document.getElementById('questions').style.display = 'none';
            document.getElementById('result').style.display = 'block';
            progress.style.width = `100%`;
        } else {
            alert(languageSelect.value === 'ar' ? "حدث خطأ أثناء حفظ البيانات" : "An error occurred while saving data");
        }
    } catch (err) {
        console.error("❌ خطأ أثناء إرسال البيانات:", err);
        alert(languageSelect.value === 'ar' ? "حدث خطأ أثناء إرسال البيانات 😢" : "An error occurred while sending data 😢");
    }
}

// عرض أول سؤال عند بداية الصفحة
showQuestion(currentIndex);

// التحكم في اللغة
languageSelect.addEventListener('change', () => {
    const lang = languageSelect.value;

    // تغيير النصوص للعناصر المختلفة
    document.querySelectorAll('[data-ar]').forEach(el => {
        if(el.dataset[lang]) el.innerText = el.dataset[lang];
    });

    // تغيير Placeholders للـ inputs
    document.querySelectorAll('input[data-ar]').forEach(input => {
        if(input.dataset[lang]) {
            input.placeholder = input.dataset[lang];
        }
    });
});
