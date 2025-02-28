const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTask = async (req, res) => {
    try {
        const { title, description, status, due_date } = req.body;

        // ตรวจสอบว่า title และ status มีค่าหรือไม่ (เป็น required fields)
        if (!title || !status) {
            return res.status(400).json({
                status: "error",
                message: "Title and status are required",
            });
        }

        // แปลง due_date ให้เป็น Date object (ถ้ามีค่า)
        const formattedDueDate = due_date ? new Date(due_date) : null;

        // สร้าง Task ใหม่
        const task = await prisma.tasks.create({
            data: {
                title,
                description,
                status,
                due_date: formattedDueDate, // ใส่ค่า due_date ที่แปลงแล้ว
            }
        });

        res.status(201).json({
            status: "ok",
            message: `Task with id ${task.id} created successfully`,
            task
        });
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({
            status: "error",
            message: "Error creating task",
            error: err.message,
        });
    }
};




//get all tasks
const getTasks = async (req, res) => {
    const task = await prisma.tasks.findMany(); // แก้ชื่อ table เป็น tasks
    res.json(task);
}

//get only one task by id
const getTask = async (req, res) => {
    const id  = req.params.id;
    try {
        const task = await prisma.tasks.findUnique({ // แก้ชื่อ table เป็น tasks
            where: {id: Number(id)},
        });
        if (!task) {
            res.status(404).json({
                message: `Task not found`
            });
        } else {
            res.status(200).json(task);
        }
                
        }catch (err) {
        res.status(500).json(err);  
        }
    }

//update task by id


const updateTask = async (req, res) => {
    const id = Number(req.params.id);
    let { title, description, status, due_date } = req.body;

    try {
        // ตรวจสอบว่า Task มีอยู่จริงหรือไม่
        const existingTask = await prisma.tasks.findUnique({
            where: { id }
        });

        if (!existingTask) {
            return res.status(404).json({
                status: "error",
                message: `Task with id ${id} not found`,
            });
        }

        // แปลง ENUM status ให้ตรงกับ schema.prisma
        const validStatuses = ["Pending", "In_Progress", "Completed"]; // ต้องตรงกับ ENUM
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                status: "error",
                message: `Invalid status value. Expected one of ${validStatuses.join(", ")}`,
            });
        }

        // แปลง due_date เป็น Date object ถ้ามีค่า
        const formattedDueDate = due_date ? new Date(due_date) : null;

        // อัปเดตข้อมูล Task
        const updatedTask = await prisma.tasks.update({
            where: { id },
            data: {
                title,
                description,
                status,
                due_date: formattedDueDate,
            }
        });

        res.status(200).json({
            status: "ok",
            message: `Task with id ${updatedTask.id} updated successfully`,
            task: updatedTask
        });
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json({
            status: "error",
            message: "Error updating task",
            error: err.message,
        });
    }
};

//delete task by id
const deleteTask = async (req, res) => {
    const id = req.params.id;
    try {
        const existingTask = await prisma.tasks.findUnique({ // แก้ชื่อ table เป็น tasks
            where: {id: Number(id)

            },
        });
        //ถ้าไม่มี task ที่ต้องการลบ
        if (!existingTask) {
            return res.status(404).json({
                message: `Task not found`
            });
        }
        await prisma.tasks.delete({ // แก้ชื่อ table เป็น tasks
            where: {id: Number(id)},
        });
        res.status(200).json({
            status: "ok",
            message: `Task with id ${id} deleted successfully`,
        });
    } 
    catch (err) {
        res.status(500).json(err);
    }
}  


module.exports = { 
    createTask, getTask, getTasks, updateTask, deleteTask
};