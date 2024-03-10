from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import *
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import and_
import time
import os
import uuid
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy import func


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:pq232536@127.0.0.1:3306/scholarship'
app.config["JSON_AS_ASCII"] = False
app.config['SECRET_KEY'] = 'pq232536'

app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN']=True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=True
SQLALCHEMY_POOL_SIZE = 20
SQLALCHEMY_POOL_TIMEOUT = 300

CORS(app, resources={"*": {"origins": {"http://localhost:4200"}}}, supports_credentials=True)
db = SQLAlchemy(app) #实例化

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.String, primary_key=True)
    password = db.Column(db.String)
    name = db.Column(db.String)
    role = db.Column(db.String)
    class_name = db.Column(db.String)
    major = db.Column(db.String)
    master = db.Column(db.String)
    scholarship = db.Column(db.String)

class Inform(db.Model):
    __tablename__='inform'
    id = db.Column(db.Integer,primary_key=True,autoincrement=True) #表id
    file_id = db.Column(db.String) #件id
    file_name = db.Column(db.String) #文件名称
    theme = db.Column(db.String)  # 公告主题
    description = db.Column(db.String)  # 公告内容
    add_times = db.Column(db.Integer)  # 新增公告的时间

class Score(db.Model):
    __tablename__='score'
    id = db.Column(db.Integer,primary_key=True,autoincrement=True) #表id
    course = db.Column(db.String) #课程名称
    teacher = db.Column(db.String) #老师
    credit = db.Column(db.Integer)  # 学分
    student_number = db.Column(db.String)  # 学号
    student_name = db.Column(db.String)  # 姓名
    score = db.Column(db.Integer)  # 成绩

#加分材料
class Activity(db.Model):
    __tablename__='activity'
    id = db.Column(db.Integer,primary_key=True,autoincrement=True) #申请id
    fileId = db.Column(db.String) #申请文件id
    fileName = db.Column(db.String) #申请文件名称
    study = db.Column(db.Integer) # 科研成绩
    competition = db.Column(db.Integer) # 竞赛成绩
    society = db.Column(db.Integer) # 社会活动
    status = db.Column(db.Integer) #状态：1-待审核，2-审核通过，3-审核不通过
    user_id = db.Column(db.String) #学生账号
    description = db.Column(db.String) #审核说明

# 民主评议成绩
class Democracy(db.Model):
    __tablename__='democracy'
    id = db.Column(db.Integer,primary_key=True,autoincrement=True) #申请id
    student_number = db.Column(db.String)  # 学号
    student_name = db.Column(db.String)  # 姓名
    class_name = db.Column(db.String) # 班级名称
    major = db.Column(db.String)  # 专业
    democracy = db.Column(db.Integer)  # 成绩

#升档材料
class Upgrade(db.Model):
    __tablename__='upgrade'
    id = db.Column(db.Integer,primary_key=True,autoincrement=True) #申请id
    fileId = db.Column(db.String) #申请文件id
    fileName = db.Column(db.String) #申请文件名称
    status = db.Column(db.Integer) #状态：1-待审核，2-审核通过，3-审核不通过
    user_id = db.Column(db.String) #学生账号

class SalesPerson(db.Model):
    __tablename__ = 'sales_person'
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String)
    sex = db.Column(db.String)
    area = db.Column(db.String)
    phone_number = db.Column(db.String)


class Product(db.Model):
    __tablename__ = 'product'
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String)
    statement = db.Column(db.String)
    price = db.Column(db.Integer)


class Order(db.Model):
    __tablename__ = 'order_info'
    id = db.Column(db.String, primary_key=True)
    product_id = db.Column(db.String)
    sales_person_id = db.Column(db.String)
    customer = db.Column(db.String)
    address = db.Column(db.String)
    contact = db.Column(db.Date)
    date = db.Column(db.String)
    sales_amount = db.Column(db.Integer)


@app.route('/file/upload', methods=['POST'])
def upload():
    img = request.files['avatar']
    basepath = os.path.dirname(__file__)  # 当前文件所在路径
    # upload_path = os.path.join(basepath, 'static/images', secure_filename(img.filename))  # 注意：没有的文件夹一定要先创建，不然会提示没有该路径
    fileName = '%s%s' % (uuid.uuid1(), os.path.splitext(img.filename)[-1]);
    upload_path = os.path.join(basepath, 'static/images', fileName)
    img.save(upload_path)
    return {
        'status': 1,
        'fileName': fileName
    }


@app.route('/register', methods=['POST'])
def register():
    json = request.json
    userId = json.get('userId')
    s = User.query.filter(and_(User.id == userId)).first()
    if s:
        return {
            'status': 0,
            'message': '学工号已存在！'
        }
    password = json.get('password')
    name = json.get('name')
    role = json.get('role')
    class_name = json.get('class_name')
    major = json.get('major')
    master = json.get('master')
    scholarship = json.get('scholarship')
    s = User(
        id=userId,
        password=password,
        name=name,
        role=role,
        class_name = class_name,
        major = major,
        master = master,
        scholarship = scholarship
    )
    db.session.add(s)
    db.session.commit()
    if s:
        return {
            'status': 1,
            'message': '注册成功！'
        }
    else:
        return {
            'status': 0,
            'message': '注册失败！'
        }

@app.route('/login', methods=['POST'])
def login():
    json = request.json
    userId = json.get('userId')
    password = json.get('password')
    s = User.query.filter(and_(User.id == userId, User.password == password)).first()
    if s:
        return {
            'status': 1,
            'userID': s.id,
            'name': s.name,
            'password': s.password,
            'role': s.role,
            'class_name': s.class_name,
            'major': s.major,
            'master': s.master,
            'scholarship': s.scholarship
        }
    else:
        return {
            'status': 0,
            'message': '用户名或密码错误！'
        }

@app.route('/getUser', methods=['POST'])
def getUser():
    json = request.json
    userId = json.get('userId')
    s = User.query.filter(and_(User.id == userId)).first()
    if s:
        return {
            'status': 1,
            'userId': s.id,
            'name': s.name,
            'password': s.password,
            'role': s.role,
            'class_name': s.class_name,
            'major': s.major,
            'master': s.master,
            'scholarship': s.scholarship
        }
    else:
        return {
            'status': 0,
            'message': '用户%s不存在！' % userId
        }

# 新建公告
@app.route('/addInform',methods=['POST'])
def addInform():
    json = request.json
    theme = json.get('theme')
    description=json.get('description')
    fileId = json.get('fileId')
    fileName=json.get('fileName')
    add_times = time.time()
    s=Inform(
        theme = theme,
        description = description,
        file_id = fileId,
        file_name=fileName,
        add_times=add_times
    )
    db.session.add(s)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'新增公告成功!'
        }
    else:
        return{
            'status':0,
            'message':'新增公告失败!'
        }

# 展示所有公告信息
@app.route('/getAllInform',methods=['GET'])
def getAllInform():
    informs = Inform.query.all()
    informList = []
    for a in informs:
        informList.append({
            'informId': a.id,
            'fileName': a.file_name,
            'fileId': a.file_id,
            'theme': a.theme,
            'description': a.description,
            'add_times':a.add_times
        })
    if a:
        return{
            'status':1,
            'message': '',
            'data':informList
        }
    else:
        return{
            'status':0,
            'message':''
        }
#公告模糊查询，未实现
@app.route('/getInform', methods=['POST'])
def getInform():
    json = request.json
    theme = json.get('theme')
    if (theme != ''):
        #t = 'select id,file_id,file_name,theme,add_times,description from inform where theme = "%s"' % theme
        informs = Inform.query.filter(Inform.theme.like("%{0}%".format(theme))).all()
        print(informs)
    else:
        if theme == '':
            #t = 'select id,file_id,file_name,theme,add_times,description from inform'
            informs = Inform.query.all()
            print(informs)
    #informs = db.session.execute(t)
    informList = []
    for s in informs:
        informList.append({
            'informId': s.id,
            'file_id': s.file_id,
            'file_name': s.file_name,
            'description': s.description,
            'theme': s.name,
            'add_times': s.add_times
        })
    return {
        'data': informList,
        'message': '',
        'status': 1
    }
# 公告删除
@app.route('/deleteInform', methods=['POST'])
def deleteInform():
    json = request.json
    id = json.get('informId')
    s = 'delete from inform where id="%s"' % id
    db.session.execute(s)
    db.session.commit()
    if s:
        return {
            'status': 1,
            'message': '删除成功！'
        }
    else:
        return {
            'status': 0,
            'message': '删除失败！'
        }
# 新增成绩
@app.route('/addScore',methods=['POST'])
def addScore():
    json = request.json
    course= json.get('course')
    teacher=json.get('teacher')
    credit = json.get('credit')
    student_number=json.get('student_number')
    student_name = json.get('student_name')
    score = json.get('score')
    s=Score(
        course=course,
        teacher = teacher,
        credit = credit,
        student_number = student_number,
        student_name = student_name,
        score = score
    )
    db.session.add(s)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'新增成绩成功!'
        }
    else:
        return{
            'status':0,
            'message':'新增成绩失败!'
        }
# 展示所有成绩
@app.route('/getAllScore',methods=['GET'])
def getAllScore():
    Scores = Score.query.all()
    scoreList = []
    for a in Scores:
        scoreList.append({
            'id': a.id,
            'course': a.course,
            'teacher': a.teacher,
            'credit': a.credit,
            'student_number': a.student_number,
            'student_name': a.student_name,
            'score':a.score
        })
    #print(scoreList)
    if a:
        return{
            'status':1,
            'message': '',
            'data':scoreList
        }
    else:
        return{
            'status':0,
            'message':''
        }
# 成绩删除
@app.route('/deleteScore', methods=['POST'])
def deleteScore():
    json = request.json
    id = json.get('id')
    s = 'delete from score where id="%s"' % id
    db.session.execute(s)
    db.session.commit()
    if s:
        return {
            'status': 1,
            'message': '删除成功！'
        }
    else:
        return {
            'status': 0,
            'message': '删除失败！'
        }
# 新增活动材料
@app.route('/addActivity',methods=['POST'])
def addActivity():
    json = request.json
    fileId = json.get('fileId')
    fileName=json.get('fileName')
    study = json.get('study')
    competition = json.get('competition')
    society = json.get('society')
    status=1
    user_id = json.get('userId')
    s=Activity(
        fileId = fileId,
        fileName = fileName,
        study=study,
        competition=competition,
        society=society,
        status = status,
        user_id=user_id
    )
    db.session.add(s)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'材料提交成功!'
        }
    else:
        return{
            'status':0,
            'message':'材料提交失败!'
        }
#查看某位同学的材料
@app.route('/getActivity/<userId>',methods=['GET'])
def getActivity(userId):
    a = Activity.query.filter(and_(Activity.user_id == userId)).first()
    if a:
        return{
            'status':1,
            'message': '',
            'data':{
                'userId': a.user_id,
                'fileName': a.fileName,
                'fileId': a.fileId,
                'study': a.study,
                'competition': a.competition,
                'society': a.society,
                'id': a.id,
                'status': a.status,
                'description': a.description
            }
        }
    else:
        return{
            'status':0,
            'message':''
        }

# 获取所有的材料信息
@app.route('/getAllActivity',methods=['GET'])
def getAllActivity():
    activity = Activity.query.all()
    activityList = []
    for a in activity:
        activityList.append({
            'userId': a.user_id,
            'fileName': a.fileName,
            'fileId': a.fileId,
            'status': a.status,
            'id': a.id,
            'study': a.study,
            'competition': a.competition,
            'society': a.society,
            'description': a.description
        })
    print(activityList)
    if a:
        return{
            'status':1,
            'message': '',
            'data':activityList
        }
    else:
        return{
            'status':0,
            'message':''
        }

#材料审核
@app.route('/changeActivityStatus',methods=['POST'])
def changeActivityStatus():
    json = request.json
    id = json.get('id')
    status = json.get('status')
    userId = json.get('userId')
    # 状态为2表示通过，档管理时，如果升档材料通过，更新成绩表里的等级
    s = 'update activity set status=%d where id=%d' % (status, id)
    db.session.execute(s)
    db.session.commit()
    if status == 3:
        s1 = 'update activity set study = 0,competition=0,society=0 where id=%d' % (id)
        db.session.execute(s1)
        db.session.commit()
        if s1:
            return{'status':1}
        else:
            return{'status':0}
    if s:
        return{
            'status':1,
            'message':'审核成功!'
        }
    else:
        return{
            'status':0,
            'message':'审核失败!'
        }
# 新增民主评议
@app.route('/addDemocracy',methods=['POST'])
def addDemocracy():
    json = request.json
    student_number=json.get('student_number')
    student_name = json.get('student_name')
    class_name = json.get('class_name')
    major = json.get('major')
    democracy = json.get('democracy')
    s=Democracy(
        student_number = student_number,
        student_name = student_name,
        class_name=class_name,
        major=major,
        democracy = democracy
    )
    db.session.add(s)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'新增民主评议成功!'
        }
    else:
        return{
            'status':0,
            'message':'新增民主评议失败!'
        }
# 展示所有民主评议
@app.route('/getAllDemocracy',methods=['GET'])
def getAllDemocracy():
    democracy = Democracy.query.all()
    democracyList = []
    for a in democracy:
        democracyList.append({
            'id': a.id,
            'major': a.major,
            'class_name': a.class_name,
            'student_number': a.student_number,
            'student_name': a.student_name,
            'democracy':a.democracy
        })
    if a:
        return{
            'status':1,
            'message': '',
            'data':democracyList
        }
    else:
        return{
            'status':0,
            'message':''
        }
# 删除民主评议
@app.route('/deleteDemocracy', methods=['POST'])
def deleteDemocracy():
    json = request.json
    id = json.get('id')
    s = 'delete from democracy where id="%s"' % id
    db.session.execute(s)
    db.session.commit()
    if s:
        return {
            'status': 1,
            'message': '删除成功！'
        }
    else:
        return {
            'status': 0,
            'message': '删除失败！'
        }
# 修改排名后30%的奖学金等级
@app.route('/setScholarship30')
def setScholarship30():
    # 先求出所有的学生人数
    s = 'select count(*) as num from user where user.role="学生" '
    number = db.session.execute(s)
    for i in number:
        num1 = i.num
    num2 = int(num1 * 0.3)
    #拿到排名后30%的数据
    s1 = 'select s.student_number,sum(s.score*s.credit)/sum(s.credit) score, ' \
        'avg(a.study) study,avg(a.competition) competition,avg(a.society) society,avg(d.democracy) democracy,' \
        '(0.8*sum(s.score*s.credit)/sum(s.credit)+ 0.08*avg(a.study) + 0.02*avg(a.competition)+0.05*avg(a.society) + 0.05*avg(d.democracy)) total ' \
        'from score s,activity a,democracy d where s.student_number = a.user_id and s.student_number = d.student_number ' \
        'group by s.student_number order by total limit %s' % num2
    scores1 = db.session.execute(s1)
    # 逻辑判断，更新user表的奖学金等级
    for s in scores1:
        s3 = 'update user set scholarship="二等奖学金" where scholarship="一等奖学金" and id="%s"' % s.student_number
        db.session.execute(s3)
        db.session.commit()
    if s3:
        return {
            'status': 1
        }
    else:
        return {
            'status': 0
        }

# 修改排名后10%的奖学金等级
@app.route('/setScholarship10')
def setScholarship10():
    # 先求出所有的学生人数
    s = 'select count(*) as num from user where user.role="学生" '
    number = db.session.execute(s)
    for i in number:
        num1 = i.num
    num3 = int(num1*0.1)
    # 拿到排名后10%的数据
    s2 = 'select s.student_number,sum(s.score*s.credit)/sum(s.credit) score, ' \
         'avg(a.study) study,avg(a.competition) competition,avg(a.society) society,avg(d.democracy) democracy,' \
         '(0.8*sum(s.score*s.credit)/sum(s.credit)+ 0.08*avg(a.study) + 0.02*avg(a.competition)+0.05*avg(a.society) + 0.05*avg(d.democracy)) total ' \
         'from score s,activity a,democracy d where s.student_number = a.user_id and s.student_number = d.student_number ' \
         'group by s.student_number order by total limit %s' % num3
    scores2 = db.session.execute(s2)
    # 逻辑判断，更新user表的奖学金等级
    for s in scores2:
        s4 = 'update user set scholarship="三等奖学金" where scholarship="二等奖学金" and id="%s"' % s.student_number
        db.session.execute(s4)
        db.session.commit()
    if s4:
        return {
            'status': 1
        }
    else:
        return {
            'status': 0
        }
# 获取总成绩
@app.route('/getManagerScores')
def getManagerScores():
    s = 'select * from (select s.student_number,round(sum(s.score*s.credit)/sum(s.credit),2) score, ' \
        'round(avg(a.study),2) study,round(avg(a.competition),2) competition,round(avg(a.society),2) society,round(avg(d.democracy),2) democracy,' \
        'round((0.8*sum(s.score*s.credit)/sum(s.credit)+ 0.08*avg(a.study) + 0.02*avg(a.competition)+0.05*avg(a.society) + 0.05*avg(d.democracy)),2) total ' \
        'from score s,activity a,democracy d where s.student_number = a.user_id and s.student_number = d.student_number ' \
        'group by s.student_number order by total) t,user where t.student_number = user.id '
    scores = db.session.execute(s)
    scoresList = []
    for s in scores:
        scoresList.append({
            'student_number': s.student_number,
            'student_name':s.name,
            'class_name':s.class_name,
            'scholarship':s.scholarship,
            'score': s.score,
            'study': s.study,
            'competition': s.competition,
            'society': s.society,
            'democracy': s.democracy,
            'total': s.total
        })
    return {
        'data': scoresList,
        'message': '',
        'status': 1
    }
# 新增升档材料
@app.route('/addUpgrade',methods=['POST'])
def addUpgrade():
    json = request.json
    fileId = json.get('fileId')
    fileName=json.get('fileName')
    status=1
    user_id = json.get('userId')
    s=Upgrade(
        fileId = fileId,
        fileName = fileName,
        status = status,
        user_id=user_id
    )
    db.session.add(s)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'材料提交成功!'
        }
    else:
        return{
            'status':0,
            'message':'材料提交失败!'
        }
#查看某位同学的升档材料
@app.route('/getUpgrade/<userId>',methods=['GET'])
def getUpgrade(userId):
    a = Upgrade.query.filter(and_(Upgrade.user_id == userId)).first()
    if a:
        return{
            'status':1,
            'message': '',
            'data':{
                'userId': a.user_id,
                'fileName': a.fileName,
                'fileId': a.fileId,
                'id': a.id,
                'status': a.status
            }
        }
    else:
        return{
            'status':0,
            'message':''
        }
# 获取所有的材料信息
@app.route('/getAllUpgrade',methods=['GET'])
def getAllUpgrade():
    upgrade = Upgrade.query.all()
    upgradeList = []
    for a in upgrade:
        upgradeList.append({
            'userId': a.user_id,
            'fileName': a.fileName,
            'fileId': a.fileId,
            'status': a.status,
            'id': a.id,
        })
    if a:
        return{
            'status':1,
            'message': '',
            'data':upgradeList
        }
    else:
        return{
            'status':0,
            'message':''
        }

#材料审核
@app.route('/changeUpgradeStatus',methods=['POST'])
def changeUpgradeStatus():
    json = request.json
    id = json.get('id')
    status = json.get('status')
    userId = json.get('userId')
    # 先求该学生的奖学金等级
    s0 = 'select scholarship from user where user.id="%s" ' % userId
    scholarship = db.session.execute(s0)
    for i in scholarship:
        scholarship1 = i.scholarship
    # 状态为2表示通过，档管理时，如果升档材料通过，更新成绩表里的等级
    if status == 2 and scholarship1 == '三等奖学金':
        s = 'update upgrade set status=%d where id=%d' % (status, id)
        s1 = 'update user set scholarship="二等奖学金" where id="%s"' % (userId)
    elif status == 2 and scholarship1 == '二等奖学金':
        s = 'update upgrade set status=%d where id=%d' % (status, id)
        s1 = 'update user set scholarship="一等奖学金" where id="%s"' % (userId)
    else:
        s = 'update upgrade set status=%d where id=%d' % (status, id)
    db.session.execute(s)
    if s1:
        db.session.execute(s1)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'审核成功!'
        }
    else:
        return{
            'status':0,
            'message':'审核失败!'
        }
# 学生查询成绩
@app.route('/getStudentScore',methods=['POST'])
def getStudentScore():
    json = request.json
    userId = json.get('userId')
    s = 'select * from (select s.student_number,round(sum(s.score*s.credit)/sum(s.credit),2) score, ' \
        'round((a.study),2) study,round(avg(a.competition),2) competition,round(avg(a.society),2) society,round(avg(d.democracy),2) democracy,' \
        'round((0.8*sum(s.score*s.credit)/sum(s.credit)+ 0.08*avg(a.study) + 0.02*avg(a.competition)+0.05*avg(a.society) + 0.05*avg(d.democracy)),2) total ' \
        'from score s,activity a,democracy d where s.student_number = a.user_id and s.student_number = d.student_number ' \
        'group by s.student_number) t,user where t.student_number = user.id and t.student_number = "%s" ' % userId
    scores = db.session.execute(s)
    scoreList = []
    for s in scores:
        scoreList.append({
            'student_number': s.student_number,
            'student_name':s.name,
            'class_name':s.class_name,
            'scholarship':s.scholarship,
            'score': s.score,
            'study': s.study,
            'competition': s.competition,
            'society': s.society,
            'democracy': s.democracy,
            'total': s.total
        })
    print(scoreList)
    if s:
        return{
            'status':1,
            'message': '',
            'data':scoreList
        }
    else:
        return{
            'status':0,
            'message':''
        }
# 获取所有用户数据
@app.route('/getAllUser',methods=['GET'])
def getAllUser():
    Users = User.query.all()
    userList = []
    for s in Users:
        userList.append({
            'userId': s.id,
            'name': s.name,
            'password': s.password,
            'role': s.role,
            'class_name': s.class_name,
            'major': s.major,
            'master': s.master,
            'scholarship': s.scholarship
        })
    #print(scoreList)
    if s:
        return{
            'status':1,
            'message': '',
            'data':userList
        }
    else:
        return{
            'status':0,
            'message':''
        }
# 删除某条用户信息
@app.route('/deleteUsers', methods=['POST'])
def deleteUsers():
    json = request.json
    id = json.get('userId')
    s = 'delete from user where id="%s"' % id
    db.session.execute(s)
    db.session.commit()
    if s:
        return {
            'status': 1,
            'message': '删除成功！'
        }
    else:
        return {
            'status': 0,
            'message': '删除失败！'
        }
#修改密码
@app.route('/setPassword',methods=['POST'])
def setPassword():
    json = request.json
    password = json.get('Password')
    userId = json.get('userId')
    s = 'update user set password="%s" where id="%s"' % (password, userId)
    db.session.execute(s)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'修改成功!'
        }
    else:
        return{
            'status':0,
            'message':'修改失败!'
        }
#增加材料审核说明
@app.route('/setDescription',methods=['POST'])
def setDescription():
    json = request.json
    description = json.get('Description')
    userId = json.get('userId')
    s = 'update activity set description="%s" where status = 3 and user_id="%s"' % (description, userId)
    db.session.execute(s)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'新增说明成功!'
        }
    else:
        return{
            'status':0,
            'message':'新增说明失败!'
        }

@app.route('/addSalesPerson', methods=['POST'])
def addSalesPerson():
    json = request.json
    salesPersonId = json.get('salesPersonId')
    s = SalesPerson.query.filter(and_(SalesPerson.id == salesPersonId)).first()
    if s:
        return {
            'status': 0,
            'message': '业务员工号已存在！'
        }
    name = json.get('name')
    sex = json.get('sex')
    area = json.get('area')
    phoneNumber = json.get('phoneNumber')
    s = SalesPerson(
        id=salesPersonId,
        name=name,
        sex=sex,
        area=area,
        phone_number=phoneNumber
    )
    db.session.add(s)
    db.session.commit()
    if s:
        return {
            'status': 1
        }
    else:
        return {
            'status': 0
        }


@app.route('/addProduct', methods=['POST'])
def addProduct():
    json = request.json
    productId = json.get('productId')
    s = Product.query.filter(and_(Product.id == productId)).first()
    if s:
        return {
            'status': 0,
            'message': '保险产品编号已存在！'
        }
    name = json.get('name')
    statement = json.get('statement')
    price = json.get('price')
    s = Product(
        id=productId,
        name=name,
        statement=statement,
        price=price
    )
    db.session.add(s)
    db.session.commit()
    if s:
        return {
            'status': 1
        }
    else:
        return {
            'status': 0,
            'message': '保险产品创建失败！'
        }


@app.route('/getSalesPersons', methods=['POST'])
def getSalesPersons():
    json = request.json
    name = json.get('name')
    area = json.get('area')
    if (name != '') and (area != ''):
        salesPersons = SalesPerson.query.filter(and_(SalesPerson.name == name, SalesPerson.area == area))
    else:
        if area != '':
            salesPersons = SalesPerson.query.filter(and_(SalesPerson.area == area))
        else:
            if name != '':
                salesPersons = SalesPerson.query.filter(and_(SalesPerson.name == name))
            else:
                salesPersons = SalesPerson.query.all()
                # return {
                #     'message': '姓名和战区都为空！',
                #     'status': 0
                # }
    salesPersonList = []
    for s in salesPersons:
        salesPersonList.append({
            'salesPersonId': s.id,
            'name': s.name,
            'sex': s.sex,
            'area': s.area,
            'phoneNumber': s.phone_number,
        })
    return {
        'data': salesPersonList,
        'message': '',
        'status': 1
    }


@app.route('/getProducts')
def getProducts():
    products = Product.query.all()
    productList = []
    for s in products:
        productList.append({
            'productId': s.id,
            'name': s.name,
            'statement': s.statement,
            'price': s.price
        })
    return {
        'data': productList,
        'message': '',
        'status': 1
    }


@app.route('/deleteProduct', methods=['POST'])
def deleteProduct():
    json = request.json
    productId = json.get('productId')
    s = 'delete from product where id="%s"' % productId
    db.session.execute(s)
    db.session.commit()
    if s:
        return {
            'status': 1,
            'message': '删除成功！'
        }
    else:
        return {
            'status': 0,
            'message': '删除产品失败！'
        }


@app.route('/deleteOrder', methods=['POST'])
def deleteOrder():
    json = request.json
    orderId = json.get('orderId')
    s = 'delete from order_info where id="%s"' % orderId
    db.session.execute(s)
    db.session.commit()
    if s:
        return {
            'status': 1,
            'message': '删除成功！'
        }
    else:
        return {
            'status': 0,
            'message': '删除订单失败！'
        }


@app.route('/deleteSalesPerson', methods=['POST'])
def deleteSalesPerson():
    json = request.json
    salesPersonId = json.get('salesPersonId')
    s = 'delete from sales_person where id="%s"' % salesPersonId
    db.session.execute(s)
    db.session.commit()
    if s:
        return {
            'status': 1,
            'message': '删除成功！'
        }
    else:
        return {
            'status': 0,
            'message': '删除失败！'
        }


@app.route('/addOrder', methods=['POST'])
def addOrder():
    json = request.json
    orderId = json.get('orderId')
    productId = json.get('productId')
    salesPersonId = json.get('salesPersonId')
    if Order.query.filter(and_(Order.id == orderId)).count() > 0:
        return {
            'status': 0,
            'message': '订单编号%s已存在！' % orderId
        }
    if SalesPerson.query.filter(and_(SalesPerson.id == salesPersonId)).count() == 0:
        return {
            'status': 0,
            'message': '业务人员%s不存在！' % salesPersonId
        }
    if Product.query.filter(and_(Product.id == productId)).count() == 0:
        return {
            'status': 0,
            'message': '保险产品%s不存在！' % productId
        }
    customer = json.get('customer')
    address = json.get('address')
    contact = json.get('contact')
    date = datetime.datetime.strptime(json.get('date'), '%Y-%m-%d')
    salesAmount = json.get('salesAmount')
    s = Order(
        id=orderId,
        product_id=productId,
        sales_person_id=salesPersonId,
        customer=customer,
        address=address,
        contact=contact,
        date=date,
        sales_amount=salesAmount
    )
    db.session.add(s)
    db.session.commit()
    if s:
        return {
            'status': 1,
            'message': '订单创建成功！'
        }
    else:
        return {
            'status': 0,
            'message': '订单创建失败！'
        }


@app.route('/getOrders', methods=['POST'])
def getOrders():
    json = request.json
    orderId = json.get('orderId')
    area = json.get('area')
    date = json.get('date')
    s = 'select o.id,o.product_id,p.name product_name,o.sales_person_id,s.name sales_person_name,s.area,o.customer, ' \
        'o.address, o.contact,date_format(o.date,"%Y-%m-%d") date,o.sales_amount from order_info o,' \
        'sales_person s,product p where o.sales_person_id ' \
        '= s.id and o.product_id=p.id '
    if orderId != '':
        s = '%s and o.id="%s"' % (s, orderId)
    if area != '':
        s = '%s and s.area="%s"' % (s, area)
    if date != '':
        s = '%s and o.date=STR_TO_DATE("%s",' % (s, date) + '"%Y-%m-%d")'
    orders = db.session.execute(s)
    orderList = []
    for s in orders:
        orderList.append({
            'orderId': s.id,
            'productId': s.product_id,
            'productName': s.product_name,
            'salesPersonId': s.sales_person_id,
            'salesPersonName': s.sales_person_name,
            'area': s.area,
            'customer': s.customer,
            'address': s.address,
            'contact': s.contact,
            'date': s.date,
            'salesAmount': s.sales_amount
        })
    return {
        'data': orderList,
        'message': '',
        'status': 1
    }


@app.route('/getAreaStats', methods=['POST'])
def getAreaStats():
    json = request.json
    startDate = json.get('startDate')
    endDate = json.get('endDate')
    s = 'select s.area, CAST(sum(o.sales_amount) AS SIGNED) achievement from order_info o,' \
        'sales_person s where o.sales_person_id=s.id '
    s = '%s and o.date>=STR_TO_DATE("%s",' % (s, startDate) + '"%Y-%m-%d") '
    s = '%s and o.date<=STR_TO_DATE("%s",' % (s, endDate) + '"%Y-%m-%d") group by s.area'
    areaStats = db.session.execute(s)
    areaStatsList = []
    for s in areaStats:
        areaStatsList.append({
            'area': s.area,
            'achievement': s.achievement
        })
    return {
        'data': areaStatsList,
        'message': '',
        'status': 1
    }


@app.route('/getStaffStats', methods=['POST'])
def getStaffStats():
    json = request.json
    startDate = json.get('startDate')
    endDate = json.get('endDate')
    s = 'select s.id staffId,s.name, CAST(sum(o.sales_amount) AS SIGNED) achievement from order_info o,' \
        'sales_person s where o.sales_person_id=s.id '
    s = '%s and o.date>=STR_TO_DATE("%s",' % (s, startDate) + '"%Y-%m-%d") '
    s = '%s and o.date<=STR_TO_DATE("%s",' % (s, endDate) + '"%Y-%m-%d") group by s.id,s.name'
    staffStats = db.session.execute(s)
    staffStatsList = []
    for s in staffStats:
        staffStatsList.append({
            'staffId': s.staffId,
            'name': s.name,
            'achievement': s.achievement
        })
    return {
        'data': staffStatsList,
        'message': '',
        'status': 1
    }





@app.route('/deleteUser', methods=['POST'])
def deleteUser():
    json = request.json
    userID = json.get('userID')
    s = 'delete from user where user_id="%s"' % (userID)
    db.session.execute(s)
    db.session.commit()
    if s:
        return {
            'status': 1
        }
    else:
        return {
            'status': 0
        }



'''
#用户模型
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.String, primary_key=True) #工号
    password = db.Column(db.String) #密码
    name = db.Column(db.String) #姓名
    sex = db.Column(db.String) # 性别
    phone_number = db.Column(db.String) #手机号码
    department = db.Column(db.String) #所在部门
    position = db.Column(db.String) #职位
    role = db.Column(db.String) #角色（普通用户、专家、系统管理员）
    avatar = db.Column(db.String) #头像
    credit = db.Column(db.Integer) #累计积分

#知识收藏模型
class Collect(db.Model):
    __tablename__='collect'
    collect_id=db.Column(db.Integer,primary_key=True,autoincrement=True) #收藏id
    knowledge_id = db.Column(db.Integer) #知识id
    user_id = db.Column(db.String) #用户id

#知识表模型
class Knowledge(db.Model):
    __tablename__='knowledge'
    knowledge_id = db.Column(db.Integer,primary_key=True,autoincrement=True) #知识Id
    knowledge_content = db.Column(db.String) #知识简介
    knowledge_cate = db.Column(db.String) #知识类别
    avatar = db.Column(db.String) #知识文件名称
    view_times=db.Column(db.Integer,default=0) #查看次数
    add_times=db.Column(db.Integer) #新增知识的时间

#问题表模型
class Question(db.Model):
    __tablename__='Question'
    question_id = db.Column(db.Integer,primary_key=True,autoincrement=True) #提问ID
    quest_to_professor_id = db.Column(db.String) #向专家提问中，所要提问的专家ID
    questioner_id = db.Column(db.String) #提问者ID，参照的是用户表的ID
    title = db.Column(db.String) #问题标题简介
    question_content = db.Column(db.String) #问题详情
    question_time = db.Column(db.Integer) #提问时间
    question_select = db.Column(db.String) #是否为精选提问


#回复表模型
class Answer(db.Model):
    __tablename__='answer'
    answer_id = db.Column(db.Integer,primary_key=True,autoincrement=True) #回复ID
    question_id =db.Column(db.Integer) #问题ID
    answerer_id = db.Column(db.String) #回复者ID
    answer_content = db.Column(db.String) #回复内容
    answer_time= db.Column(db.Integer) #回复时间
    answer_select = db.Column(db.String) #是否为精选回答

#专家申请表模型
class ExpertApplication(db.Model):
    __tablename__='expert_application'
    id = db.Column(db.Integer,primary_key=True,autoincrement=True) #表id
    file_id = db.Column(db.String) #申请文件id
    file_name = db.Column(db.String) #申请文件名称
    description = db.Column(db.String) #申请说明
    status = db.Column(db.Integer) #状态：1-待审核，2-审核通过，3-审核不通过
    user_id = db.Column(db.String) #用户工号



#头像上传
@app.route('/file/upload', methods=['POST'])
def upload():
    img = request.files['avatar']
    basepath = os.path.dirname(__file__)  # 当前文件所在路径
    fileName = '%s%s' % (uuid.uuid1(), os.path.splitext(img.filename)[-1]);
    upload_path = os.path.join(basepath, 'static/images', fileName)
    img.save(upload_path)
    return {
        'status': 1,
        'fileName': fileName
    }

#注册
@app.route('/register', methods=['POST'])
def register():
    json = request.json
    userId = json.get('userId')
    s = User.query.filter(and_(User.id == userId)).first()
    if s:
        return {
            'status': 0,
            'message': '员工工号已存在！'
        }
    password = json.get('password')
    name = json.get('name')
    sex = json.get('sex')
    phoneNumber = json.get('phoneNumber')
    department = json.get('department')
    position = json.get('position')
    role = json.get('role')
    avatar = json.get('avatar')
    s = User(
        id=userId,
        password=password,
        name=name,
        sex=sex,
        phone_number=phoneNumber,
        department=department,
        position=position,
        role=role,
        avatar=avatar,
        credit=0
    )
    db.session.add(s)
    db.session.commit()
    if s:
        return {
            'status': 1,
            'message': '注册成功！'
        }
    else:
        return {
            'status': 0,
            'message': '注册失败！'
        }

#登录
@app.route('/login', methods=['POST'])
def login():
    json = request.json
    userId = json.get('userId')
    password = json.get('password')
    s = User.query.filter(and_(User.id == userId, User.password == password)).first()
    if s:
        return {
            'status': 1,
            'userId': s.id,
            'name': s.name,
            'sex': s.sex,
            'password': s.password,
            'phoneNumber': s.phone_number,
            'department': s.department,
            'position': s.position,
            'role': s.role,
            'avatar': s.avatar
        }
    else:
        return {
            'status': 0,
            'message': '用户名或密码错误！'
        }

#展示个人信息
@app.route('/getUser',methods=['POST']) #一定要注明是post还是get方法，否则会报错。这里只能用post方法，否则也会报错
def getUser():
    json = request.json
    userId = json.get('userId')
    s = User.query.filter(and_(User.id==userId)).first()
    if s:
        return{
            'status':1,
            'userId':s.id,
            'name': s.name,
            'sex': s.sex,
            'password': s.password,
            'phoneNumber':s.phone_number,
            'department': s.department,
            'position':s.position,
            'role':s.role,
            'avatar':s.avatar
        }
    else:
        return{
            'status':0,
            'message':'员工%s不存在！'% userId
        }

#修改个人信息
@app.route('/setUser',methods=['POST'])
def setUser():
    json = request.json
    primaryId = json.get('primaryId')
    userId = json.get('userId')
    if primaryId != userId:
        s = User.query.filter(and_(User.id == userId)).first()
        if s:
            return{
                'status':0,
                'message':'员工工号已存在！'
            }
    name = json.get('name')
    sex = json.get('sex')
    phoneNumber = json.get('phoneNumber')
    department = json.get('department')
    position = json.get('position')
    role = json.get('role')
    avatar = json.get('avatar')
    password = json.get('password')
    s = 'update user set name="%s",sex="%s",phone_number="%s",department="%s",position="%s",role="%s",avatar="%s",password="%s",id="%s" where ' \
        'id="%s"' % (name, sex, phoneNumber, department, position, role, avatar, password, userId, primaryId)
    db.session.execute(s)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'修改成功！'
        }
    else:
        return{
            'status':0,
            'message':'修改失败！'
        }

#用户管理中获取所有用户的信息
@app.route('/getAllUsers') #没有说明请求方法就是GET请求
def getAllUsers():
    users = User.query.all()
    userList = []
    for s in users:
        userList.append({
            'userId': s.id,
            'name': s.name,
            'sex': s.sex,
            'password': s.password,
            'phoneNumber': s.phone_number,
            'department': s.department,
            'position': s.position,
            'role': s.role,
            'credit':s.credit
        })
    return{
        'data':userList,
        'message':'',
        'status':1
    }

#用户管理中删除用户信息
@app.route('/deleteUser',methods=['POST'])
def deleteUser():
    json = request.json
    userId = json.get('userId')
    s = 'delete from user where id="%s"' % userId
    db.session.execute(s)
    db.session.commit()
    if s:
        return{
            'status': 1,
            'message': '删除成功！'
        }
    else:
        return{
            'status': 0,
            'message': '删除失败！'
        }

#展示所有专家信息
@app.route('/getAllProfessors')
def getAllProfessors():
    professors=User.query.filter(and_(User.role == '专家'))
    professorList = []
    for s in professors:
        professorList.append({
            'userId': s.id,
            'name': s.name,
            'department':s.department,
            'position':s.position,
            'role':s.role,
            'avatar':s.avatar

        })
    return{
        'data': professorList,
        'message':'',
        'status':1
    }

#问答社区中获取所有的提问信息
@app.route('/getAllQuestions')
def getAllQuestions():
    s = 'select q.question_id,q.quest_to_professor_id,q.questioner_id,u.name questioner_name,u.avatar,q.title,q.question_content,q.question_time,q.question_select from user u,question q where u.id=q.questioner_id'
    questions = db.session.execute(s)
    questionList = []
    for s in questions:
        questionList.append({
            'question_id':s.question_id,
            'quest_to_professor_id':s.quest_to_professor_id,
            'questioner_id':s.questioner_id,
            'questioner_name':s.questioner_name,
            'title':s.title,
            'question_content':s.question_content,
            'question_time':s.question_time,
            'question_select':s.question_select,
            'avatar':s.avatar

        })
    return{
        'data':questionList,
        'message':'',
        'status':1
    }

#问答社区中新增提问
@app.route('/addQuestion',methods=['POST'])
def addQuestion():
    json = request.json
    questioner_id = json.get('questionerId')
    quest_to_professor_id = json.get('questToProfessorId')
    title = json.get('title')
    question_content = json.get('questionContent')
    question_time = time.time()
    s = Question(
        questioner_id=questioner_id,
        quest_to_professor_id=quest_to_professor_id,
        title = title,
        question_content=question_content,
        question_time=question_time,
        question_select = '否'
    )
    print(quest_to_professor_id)
    db.session.add(s)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'提问成功！'
        }
    else:
        return{
            'status':0,
            'message':'提问失败！'
        }

#问答社区中新增回复
@app.route('/addAnswer',methods=['POST'])
def addAnswer():
    json = request.json
    question_id = json.get('questionId')
    answerer_id = json.get('answererId')
    answer_content=json.get('answerContent')
    answer_time = time.time()
    s = Answer(
        question_id = question_id,
        answerer_id =answerer_id,
        answer_content =answer_content,
        answer_time=answer_time,
        answer_select='否',
    )
    db.session.add(s)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'回复成功！'
        }
    else:
        return{
            'status':0,
            'message':'回复失败！'
        }

#问答社区中获取所有回复信息
@app.route('/getAllAnswers')
def getAllAnswers():
    s = 'select a.question_id,a.answer_id,a.answerer_id,u.avatar,u.name answerer_name,a.answer_content,a.answer_time,a.answer_select from user u,answer a where u.id=a.answerer_id'
    answers = db.session.execute(s)
    answerList=[]
    for s in answers:
            answerList.append({
                'questionId':s.question_id,
                'answerId':s.answer_id,
                'answererId':s.answerer_id,
                'answererName': s.answerer_name,
                'answerContent': s.answer_content,
                'answerTime': s.answer_time,
                'answerSelect':s.answer_select,
                'avatar':s.avatar
            })
    return{
        'data':answerList,
        'message':'',
        'status':1
    }

#后台管理中系统管理员设置某提问为精选提问
@app.route('/updateQuestion',methods=['POST'])
def updateQuestion():
    json = request.json
    question_id = json.get('question_id')
    questioner_id = json.get('questioner_id')
    s = Question.query.filter(and_(Question.question_id == question_id)).first()
    s.question_select = '是'
    c = 'update user set credit=credit+1 where id="%s"' % (questioner_id)
    db.session.execute(c)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'精选提问设置成功！'
        }
    else:
        return{
            'status':0,
            'message':'精选提问设置失败！'
        }

#后台管理中系统管理员设置某回答为精选回答
@app.route('/updateAnswer',methods=['POST'])
def updateAnswer():
    json = request.json
    answerId = json.get('answerId')
    answererId = json.get('answererId')
    s = Answer.query.filter(and_(Answer.answer_id == answerId)).first()
    s.answer_select = '是'
    c = 'update user set credit=credit+1 where id="%s"' % (answererId)
    db.session.execute(c)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'精选回答设置成功！'
        }
    else:
        return{
            'status':0,
            'message':'精选回答设置失败！'
        }

#获取我的回答所对应的提问，不包含重复值
@app.route('/getQuestion',methods=['POST'])
def getQuestion():
    json = request.json
    answererId = json.get('userId')
    s = 'select q.question_id,q.title,q.question_select,a.answerer_id from question q,answer a where q.question_id =a.question_id'
    questions = db.session.execute(s)
    db.session.commit()
    ListOfData = []
    ListOfData2=[]
    for i in questions:
        if i.answerer_id == answererId:
            ListOfData.append({
                'question_id': i.question_id,
                'title': i.title,
                'question_select': i.question_select
            })

    for i in ListOfData:
        if i not in ListOfData2:
            ListOfData2.append(i)

    return{
        'data':ListOfData2,
        'status':1,
        'message':''
    }

#获取我的精选回答所对应的提问，不包含重复值
@app.route('/getQuestion2',methods=['POST'])
def getQuestion2():
    json = request.json
    answererId = json.get('userId')
    s = 'select q.question_id,q.title,a.answerer_id from question q,answer a where q.question_id = a.question_id and a.answer_select ="是"'
    ListOfData=[]
    ListOfData2=[]
    questions=db.session.execute(s)
    db.session.commit()
    for i in questions:
        if i.answerer_id==answererId:
            ListOfData.append({
                'question_id':i.question_id,
                'title':i.title
            })

    for i in ListOfData:
        if i not in ListOfData2:
            ListOfData2.append(i)

    return{
        'data':ListOfData2,
        'status':1,
        'message':''
    }

#新增知识
@app.route('/addKnowledge',methods=['POST'])
def addKnowledge():
    json = request.json
    knowledge_content=json.get('knowledgeContent')
    knowledge_cate = json.get('knowledgeCate')
    avatar=json.get('avatar')
    add_times = time.time()
    s=Knowledge(
        knowledge_content = knowledge_content,
        knowledge_cate = knowledge_cate,
        avatar=avatar,
        view_times = 0,
        add_times=add_times
    )
    db.session.add(s)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'新增知识成功!'
        }
    else:
        return{
            'status':0,
            'message':'新增知识失败!'
        }

#获取所有知识信息
@app.route('/getAllKnowledge')
def getAllKnowledge():
    knowledges = Knowledge.query.all()
    knowledgeList=[]
    for s in knowledges:
        knowledgeList.append({
            'knowledgeId':s.knowledge_id,
            'knowledgeContent':s.knowledge_content,
            'knowledgeCate':s.knowledge_cate,
            'avatar': s.avatar,
            'viewTimes':s.view_times,
            'addTimes':s.add_times
        })
    return{
        'status':1,
        'data':knowledgeList,
        'message':''
    }
#删除某条知识信息
@app.route('/deleteKnowledge',methods=['POST'])
def deleteKnowledge():
    json = request.json
    knowledgeId = json.get('knowledgeId')
    s = 'delete from knowledge where knowledge_id="%s"' % knowledgeId
    db.session.execute(s)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'删除成功!'
        }
    else:
        return{
            'status':0,
            'message':'删除失败!'
        }

#查看某个知识文件
@app.route('/getKnowledge',methods=['POST'])
def getKnowledge():
    json = request.json
    knowledgeId = json.get('knowledgeId')
    s = Knowledge.query.filter(and_(Knowledge.knowledge_id == knowledgeId)).first()
    if s:
        return{
            'status':1,
            'knowledgeId':s.knowledge_id,
            'knowledgeContent':s.knowledge_content,
            'knowledgeCate':s.knowledge_cate,
            'avatar':s.avatar
        }
    else:
        return{
            'status':0,
            'message':'该文件不存在！'
        }

#知识搜索
@app.route('/searchKnowledge',methods=['POST'])
def searchKnowledge():
    json = request.json
    keyword = json.get('keyword')
    knowledges = Knowledge.query.filter(Knowledge.knowledge_content.like("%{0}%".format(keyword))).all()
    print(knowledges)
    knowledgeList = []
    for k in knowledges:
        knowledgeList.append({
            'knowledgeId':k.knowledge_id,
            'knowledgeContent':k.knowledge_content,
            'knowledgeCate':k.knowledge_cate,
            'avatar':k.avatar,
        })
    return{
        'data':knowledgeList,
        'message':'',
        'status':1
    }

#提问搜索
@app.route('/searchQuestion',methods=['POST'])
def searchQuestion():
    json = request.json
    keyword = json.get('keyword')
    s = 'select q.question_id,u.name questioner_name,u.avatar from user u,question q where u.id=q.questioner_id'
    users = db.session.execute(s)
    questions = Question.query.filter(Question.title.like("%{0}%".format(keyword))).all()
    question=[]
    user=[]
    for s in questions:
        question.append({
            'question_id': s.question_id,
            'quest_to_professor_id': s.quest_to_professor_id,
            'questioner_id': s.questioner_id,
            'title': s.title,
            'question_content': s.question_content,
            'question_time': s.question_time,
            'question_select': s.question_select,

        })
    for s in users:
        user.append({
            'question_id':s.question_id,
            'questioner_name':s.questioner_name,
            'avatar':s.avatar
        })
    print(question)
    print(user)
    return{
        'data1':question,
        'data2':user,
        'message':'',
        'status':1
    }

#最新知识
@app.route('/getTopNewKnowledge',methods=['GET'])
def getTopNewKnowledge():
    knowledges = db.session.query(Knowledge).order_by(Knowledge.knowledge_id.desc()).limit(5).all()
    print(knowledges)
    knowledgeList = []
    for k in knowledges:
        knowledgeList.append({
            'knowledgeId':k.knowledge_id,
            'knowledgeContent':k.knowledge_content,
            'knowledgeCate':k.knowledge_cate,
            'avatar':k.avatar,
        })
    return{
        'data':knowledgeList,
        'message':'',
        'status':1
    }
#最热知识
@app.route('/getTopHotKnowledge',methods=['GET'])
def getTopHotKnowledge():
    knowledges = db.session.query(Knowledge).order_by(Knowledge.view_times.desc()).limit(5).all()
    print(knowledges)
    knowledgeList = []
    for k in knowledges:
        knowledgeList.append({
            'knowledgeId':k.knowledge_id,
            'knowledgeContent':k.knowledge_content,
            'knowledgeCate':k.knowledge_cate,
            'avatar':k.avatar,
        })
    return{
        'data':knowledgeList,
        'message':'',
        'status':1
    }

#知识文件浏览次数
@app.route('/changeViewTimes',methods=['POST'])
def changeViewTimes():
    json = request.json
    knowledgeId = json.get('knowledgeId')
    s = 'update knowledge set view_times=view_times+1 where knowledge_id="%s"' % (knowledgeId)
    db.session.execute(s)
    db.session.commit()
    if s:
        return {
            'status': 1
        }
    else:
        return {
            'status': 0
        }

#提交申请文件
@app.route('/submitApplication',methods=['POST'])
def submitApplication():
    json = request.json
    description=json.get('description')
    fileId = json.get('fileId')
    fileName=json.get('fileName')
    userId = json.get('userId')
    status = 1
    s=ExpertApplication(
        description = description,
        file_id = fileId,
        file_name=fileName,
        user_id=userId,
        status=status
    )
    db.session.add(s)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'申请成功!'
        }
    else:
        return{
            'status':0,
            'message':'申请失败!'
        }

#专家申请审核
@app.route('/changeApplicationStatus',methods=['POST'])
def changeApplicationStatus():
    json = request.json
    id = json.get('id')
    status = json.get('status')
    userId = json.get('userId')
    s1 = ''
    if status == 2:
        s = 'update expert_application set status=%d where id=%d' % (status, id)
        s1 = 'update user set role="专家" where id="%s"' % (userId)
    else:
        s = 'update expert_application set status=%d where id=%d' % (status, id)
    db.session.execute(s)
    if s1:
        db.session.execute(s1)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'审核成功!'
        }
    else:
        return{
            'status':0,
            'message':'审核失败!'
        }

#查看某个申请文件
@app.route('/getApplication/<userId>',methods=['GET'])
def getApplication(userId):
    a = ExpertApplication.query.filter(and_(ExpertApplication.user_id == userId)).first()
    if a:
        return{
            'status':1,
            'message': '',
            'data':{
                'userId': a.user_id,
                'fileName': a.file_name,
                'fileId': a.file_id,
                'description': a.description,
                'id': a.id,
                'status': a.status
            }
        }
    else:
        return{
            'status':0,
            'message':''
        }

#展示所有申请信息
@app.route('/getAllApplication',methods=['GET'])
def getAllApplication():
    applications = ExpertApplication.query.all()
    applicationList = []
    for a in applications:
        applicationList.append({
            'userId': a.user_id,
            'fileName': a.file_name,
            'fileId': a.file_id,
            'status': a.status,
            'id': a.id,
            'description': a.description,
        })
    if a:
        return{
            'status':1,
            'message': '',
            'data':applicationList
        }
    else:
        return{
            'status':0,
            'message':''
        }

#知识收藏
@app.route('/collect',methods=['POST'])
def collect():
    json = request.json
    knowledge_id = json.get('knowledgeId')
    user_id = json.get('userId')
    s=Collect(
        knowledge_id = knowledge_id,
        user_id=user_id
    )
    db.session.add(s)
    db.session.commit()
    if s:
        return{
            'status':1,
            'message':'收藏成功!'
        }
    else:
        return{
            'status':0,
            'message':'收藏失败!'
        }

#获取我的收藏信息
@app.route('/getAllCollect',methods=['POST'])
def getAllCollect():
    json = request.json
    userId=json.get('userId')
    s = 'select k.knowledge_id,k.knowledge_content,k.avatar,k.view_times,k.add_times,c.collect_id,c.user_id  from knowledge k,collect c where k.knowledge_id = c.knowledge_id'
    collects = db.session.execute(s)
    db.session.commit()
    collectList=[]
    for s in collects:
        if s.user_id == userId:
            collectList.append({
                'collectId': s.collect_id,
                'knowledgeId': s.knowledge_id,
                'userId': s.user_id,
                'knowledgeContent': s.knowledge_content,
                'avatar': s.avatar,
                'viewTimes': s.view_times,
                'addTimes': s.add_times
            })
    return{
        'status':1,
        'data':collectList,
        'message':''
    }

#取消收藏
@app.route('/deleteCollect',methods=['POST'])
def deleteCollect():
    json = request.json
    collectId = json.get('collectId')
    s = 'delete from collect where collect_id="%s"' % collectId
    db.session.execute(s)
    db.session.commit()
    if s:
        return{
            'status': 1,
            'message': '取消收藏成功！'
        }
    else:
        return{
            'status': 0,
            'message': '取消收藏失败！'
        }

#后台导出全部问答数据
@app.route('/getQuestionAnswer')
def getQuestionAnswer():
    s = 'select q.question_id,q.title,q.question_content,q.question_time,a.answer_id,a.answer_content,a.answer_time  from question q,answer a where q.question_id = a.question_id '
    qa = db.session.execute(s)
    db.session.commit()
    List=[]
    for s in qa:
        List.append({
            'question_id': s.question_id,
            'title': s.title,
            'question_content': s.question_content,
            'question_time': s.question_time,
            'answer_id':s.answer_id,
            'answer_content': s.answer_content,
            'answer_time': s.answer_time,
        })
    return{
        'status':1,
        'data':List,
        'message':''
    }



#测试flask是否连接上了mysql
@app.route('/')
def index():
    from sqlalchemy import text
    sql=text("select * from user")
    result = db.engine.execute(sql)
    for row in result:
        app.logger.info(row)
    return 'hello'

'''
if __name__ == '__main__':
    app.run()
