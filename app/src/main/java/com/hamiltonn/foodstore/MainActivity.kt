package com.hamiltonn.foodstore

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ProgressBar
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.recyclerview.widget.RecyclerView

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
//            fetch signin by id
            val aboutus=findViewById<Button>(R.id.about)
            aboutus.setOnClickListener {
                val intent = Intent (applicationContext,Aboutus::class.java)
                startActivity(intent)
            }
//        fetch signup
        val signup =findViewById<Button>(R.id.signup)
        signup.setOnClickListener {
            val intent = Intent(applicationContext,SignupActivity::class.java)
            startActivity(intent)
        }





//        fetch the progress bar
        val progress=findViewById<ProgressBar>(R.id.progress)
//        fetch recycler view
        val recycler= findViewById<RecyclerView>(R.id.recycler)
//        define the api
        val api="https://hamilton06.pythonanywhere.com/api/get_products_details"
//        define api helper
        val helper= ApiHelper(applicationContext)
//       load products
        helper.loadProducts(api,recycler,progress)






    }
}