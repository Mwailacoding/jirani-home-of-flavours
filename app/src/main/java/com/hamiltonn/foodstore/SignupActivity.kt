package com.hamiltonn.foodstore

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.loopj.android.http.RequestParams

class SignupActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_signup)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets

        }
        val username=findViewById<EditText>(R.id.username)
        val email=findViewById<EditText>(R.id.email)
        val phone=findViewById<EditText>(R.id.phone)
        val password=findViewById<EditText>(R.id.password)
        val signup=findViewById<Button>(R.id.signup)
//        define api
        signup.setOnClickListener {
            val api="https://modcom2.pythonanywhere.com/api/signup"
            val data=RequestParams()
            data.put("username",username.text.toString())
            data.put("email",email.text.toString())
            data.put("phone",phone.text.toString())
            data.put("password",password.text.toString())
//            define helper
            val helper=ApiHelper(applicationContext)
            helper.post(api,data)

        }
    }
}