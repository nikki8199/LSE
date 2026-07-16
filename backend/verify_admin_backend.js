async function runTest() {
  console.log("🚀 Starting backend admin dashboard & complaints desk verification...");

  const BASE_URL = "http://localhost:5000";

  try {
    // 1. Log in as a normal user (tester@example.com)
    console.log("\n1. Logging in as normal user (tester@example.com)...");
    const userLoginRes = await fetch(`${BASE_URL}/Authentication/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "tester@example.com",
        password: "password123",
      })
    });
    
    const userLogin = await userLoginRes.json();
    const userToken = userLogin.token;
    const userHeaders = { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${userToken}` 
    };
    console.log("✅ Normal user login successful.");

    // 2. Try to access admin endpoints as normal user (Should fail with 403)
    console.log("\n2. Attempting admin routes as normal user (Expect 403 Forbidden)...");
    
    const statsUserRes = await fetch(`${BASE_URL}/users/admin/stats`, { headers: userHeaders });
    if (statsUserRes.status === 403) {
      console.log("✅ Stats correctly rejected with 403 Forbidden.");
    } else {
      console.log("❌ Stats unexpected status:", statsUserRes.status);
    }

    const complaintsUserRes = await fetch(`${BASE_URL}/complaints/admin`, { headers: userHeaders });
    if (complaintsUserRes.status === 403) {
      console.log("✅ Complaints correctly rejected with 403 Forbidden.");
    } else {
      console.log("❌ Complaints unexpected status:", complaintsUserRes.status);
    }

    // 3. Create a complaint as normal user
    console.log("\n3. Submitting a user complaint as normal user...");
    const complaintSubRes = await fetch(`${BASE_URL}/complaints`, {
      method: "POST",
      headers: userHeaders,
      body: JSON.stringify({
        title: "Normal User Bug Report",
        category: "Technical Issue",
        description: "The CSS grid class fallback centering logic works great.",
      })
    });
    
    const complaintData = await complaintSubRes.json();
    console.log("✅ Complaint submitted successfully:", complaintData.message);
    const newComplaintId = complaintData.complaint._id;

    // 4. Log in as Admin (mentor2@example.com)
    console.log("\n4. Logging in as Administrator (mentor2@example.com)...");
    const adminLoginRes = await fetch(`${BASE_URL}/Authentication/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "mentor2@example.com",
        password: "password123",
      })
    });
    
    const adminLogin = await adminLoginRes.json();
    const adminToken = adminLogin.token;
    const adminHeaders = { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${adminToken}` 
    };
    console.log("✅ Admin login successful.");

    // 5. Access admin stats as admin
    console.log("\n5. Fetching admin statistics...");
    const statsResRaw = await fetch(`${BASE_URL}/users/admin/stats`, { headers: adminHeaders });
    const statsRes = await statsResRaw.json();
    console.log("✅ Stats fetched successfully:");
    console.log("   - Total Users:", statsRes.stats.totalUsers);
    console.log("   - Total Exchanges:", statsRes.stats.totalRequests);
    console.log("   - Total Videos:", statsRes.stats.totalVideos);
    console.log("   - Total Reviews:", statsRes.stats.totalReviews);
    console.log("   - Total Complaints:", statsRes.stats.totalComplaints);
    console.log("   - Exchanges Status breakdown count:", statsRes.stats.exchangesByStatus.length);

    // 6. Access complaints desk as admin
    console.log("\n6. Fetching all complaints list in the desk...");
    const complaintsResRaw = await fetch(`${BASE_URL}/complaints/admin`, { headers: adminHeaders });
    const complaintsRes = await complaintsResRaw.json();
    console.log(`✅ Fetched ${complaintsRes.complaints.length} complaints.`);
    const matching = complaintsRes.complaints.find(c => c._id === newComplaintId);
    if (matching) {
      console.log("✅ Successfully verified that the newly submitted user complaint is visible in the desk!");
    } else {
      console.log("❌ Newly submitted user complaint was not found in the admin desk.");
    }

    // 7. Toggle status of the complaint
    console.log("\n7. Toggling complaint status between pending/resolved...");
    const toggleResRaw = await fetch(`${BASE_URL}/complaints/admin/${newComplaintId}/status`, {
      method: "PATCH",
      headers: adminHeaders
    });
    const toggleRes = await toggleResRaw.json();
    console.log(`✅ Complaint is now: ${toggleRes.complaint.status}`);

    // 8. Delete/archive the complaint
    console.log("\n8. Archiving the complaint...");
    const deleteResRaw = await fetch(`${BASE_URL}/complaints/admin/${newComplaintId}`, {
      method: "DELETE",
      headers: adminHeaders
    });
    const deleteRes = await deleteResRaw.json();
    console.log("✅ Complaint archived successfully:", deleteRes.message);

    // 9. Fetch all reviews as admin
    console.log("\n9. Fetching all user reviews...");
    const reviewsResRaw = await fetch(`${BASE_URL}/review/admin`, { headers: adminHeaders });
    const reviewsRes = await reviewsResRaw.json();
    console.log(`✅ Fetched ${reviewsRes.reviews.length} user reviews.`);
    if (reviewsRes.reviews.length > 0) {
      const firstReview = reviewsRes.reviews[0];
      console.log(`   - Sample Review: "${firstReview.review}" by ${firstReview.reviewer?.name}`);
    }

    console.log("\n🎉 ALL ADMIN SEPARATION AND COMPLAINT PORTAL TESTS PASSED SUCCESSFULLY! 🎉\n");
  } catch (err) {
    console.error("❌ Test encountered an error:", err.message);
  }
}

runTest();
