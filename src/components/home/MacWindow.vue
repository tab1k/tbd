<template>
    <div class="mac-window">
        <div class="mac-header">
            <span class="mac-btn btn-red"></span>
            <span class="mac-btn btn-yellow"></span>
            <span class="mac-btn btn-green"></span>
        </div>
        <div class="content">
            <div class="content-area">
                
            </div>
        </div>
    </div>
</template>


<style>
    .mac-window {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      max-width: 1000px;
      margin: 40px auto;
      background: #fff;
    }
    
    .mac-header {
      background: #e0e0e0;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .mac-btn {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
    }
    
    .btn-red {
      background: #ff5f56;
    }
    
    .btn-yellow {
      background: #ffbd2e;
    }
    
    .btn-green {
      background: #27c93f;
    }
    
    .content {
      display: flex;
      flex-wrap: wrap;
    }
    
    .content-area {
      min-width: 500px;
      flex: 1 1 50%;
      min-height: 300px;
      background: url("https://via.placeholder.com/500x400") center/cover no-repeat;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: bold;
      font-size: 1.2rem;
    }
    
</style>