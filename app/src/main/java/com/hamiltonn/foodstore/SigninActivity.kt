package com.hamiltonn.foodstore

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.loopj.android.http.RequestParams

class SigninActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_signin)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets}
//            step one
//            fetch 2 edittext and one button
            val email=findViewById<EditText>(R.id.email)
            val password=findViewById<EditText>(R.id.password)
            val signin=findViewById<Button>(R.id.signin)
        signin.setOnClickListener {
            val api = "https://modcom2.pythonanywhere.com/api/signin"
//            define the container to store email and password
             val data = RequestParams()
//            put email and password inside container
            data.put("email" , email.text.toString())
            data.put("password" , password.text.toString())
//            define api helper
            val helper = ApiHelper(applicationContext)
            helper.post_login(api,data)

        }
        }

    }
