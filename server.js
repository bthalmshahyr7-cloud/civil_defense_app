const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// قراءة البيانات من ملف JSON
function loadData() {
    try {
        if (!fs.existsSync('data.json')) {
            fs.writeFileSync('data.json', JSON.stringify({ records: [] }, null, 2));
        }
        return JSON.parse(fs.readFileSync('data.json'));
    } catch (e) {
        return { records: [] };
    }
}

// حفظ البيانات
function saveData(data) {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

// عرض الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// جلب السجلات
app.get('/api/records', (req, res) => {
    res.json(loadData().records || []);
});

// إضافة سجل جديد
app.post('/api/add-record', (req, res) => {
    const db = loadData();
    if (!db.records) db.records = [];

    const newRecord = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        ...req.body
    };

    db.records.push(newRecord);
    saveData(db);
    res.json({ message: 'تم الحفظ بنجاح' });
});

// حذف سجل
app.delete('/api/delete-record/:id', (req, res) => {
    const db = loadData();
    db.records = (db.records || []).filter(r => r.id != req.params.id);
    saveData(db);
    res.json({ message: 'تم الحذف بنجاح' });
});

app.listen(3000, () => {
    console.log('السيرفر شغال بنجاح على: http://localhost:3000');
});