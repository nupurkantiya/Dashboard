import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement,
  RadialLinearScale,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Pie, Radar } from 'react-chartjs-2';
import { BarChart3, LineChart, PieChart, Activity, TrendingUp, Download } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Charts = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Chart refs for cleanup
  const chartRefs = useRef({});

  // Cleanup chart instances on unmount or tab change
  useEffect(() => {
    // Cleanup previous charts when tab changes
    Object.values(chartRefs.current).forEach(chartRef => {
      if (chartRef && typeof chartRef.destroy === 'function') {
        try {
          chartRef.destroy();
        } catch (error) {
          console.warn('Error destroying chart:', error);
        }
      }
    });
    chartRefs.current = {};
  }, [activeTab]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      Object.values(chartRefs.current).forEach(chartRef => {
        if (chartRef && typeof chartRef.destroy === 'function') {
          try {
            chartRef.destroy();
          } catch (error) {
            console.warn('Error destroying chart on unmount:', error);
          }
        }
      });
    };
  }, []);

  // Function to handle chart ref assignment
  const setChartRef = (id) => (ref) => {
    if (ref && ref.chartInstance) {
      chartRefs.current[id] = ref.chartInstance;
    }
  };

  // Chart data configurations
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales',
        data: [12000, 19000, 3000, 15000, 25000, 30000, 35000, 28000, 40000, 32000, 45000, 50000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Target',
        data: [15000, 20000, 18000, 25000, 28000, 32000, 38000, 35000, 42000, 38000, 48000, 52000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: false,
        borderDash: [5, 5],
      },
    ],
  };

  const revenueData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: '2023',
        data: [85000, 92000, 78000, 95000],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
      {
        label: '2024',
        data: [90000, 98000, 85000, 102000],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
      },
    ],
  };

  const categoryData = {
    labels: ['Technology', 'Fashion', 'Food', 'Books', 'Sports', 'Home'],
    datasets: [
      {
        data: [30, 20, 15, 12, 13, 10],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const performanceData = {
    labels: ['Speed', 'Reliability', 'Features', 'Design', 'Support', 'Value'],
    datasets: [
      {
        label: 'Current',
        data: [85, 92, 78, 88, 76, 90],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
      {
        label: 'Target',
        data: [90, 95, 85, 90, 85, 95],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 750,
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
    animation: {
      duration: 750,
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    animation: {
      duration: 750,
    },
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics & Charts</h1>
            <p className="text-muted-foreground">Visualize your data with interactive charts</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Chart Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Monthly Sales Trend
                      <Badge variant="secondary">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        +12.5%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Line 
                        ref={setChartRef('sales-trend')}
                        data={salesData} 
                        options={chartOptions}
                        key={`sales-trend-${activeTab}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Quarterly Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Bar 
                        ref={setChartRef('quarterly-revenue')}
                        data={revenueData} 
                        options={chartOptions}
                        key={`quarterly-revenue-${activeTab}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Sales by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Doughnut 
                        ref={setChartRef('sales-category-doughnut')}
                        data={categoryData} 
                        options={doughnutOptions}
                        key={`sales-category-doughnut-${activeTab}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Radar 
                        ref={setChartRef('performance-radar')}
                        data={performanceData} 
                        options={radarOptions}
                        key={`performance-radar-${activeTab}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <motion.div
              variants={chartVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Sales Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <Line 
                      ref={setChartRef('detailed-sales')}
                      data={salesData} 
                      options={chartOptions}
                      key={`detailed-sales-${activeTab}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-green-600">$350,000</h3>
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-blue-600">15.3%</h3>
                    <p className="text-sm text-muted-foreground">Growth Rate</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-purple-600">1,234</h3>
                    <p className="text-sm text-muted-foreground">Orders</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Category Distribution (Pie)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Pie 
                        ref={setChartRef('category-pie')}
                        data={categoryData} 
                        options={doughnutOptions}
                        key={`category-pie-${activeTab}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Category Distribution (Doughnut)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <Doughnut 
                        ref={setChartRef('category-distribution-doughnut')}
                        data={categoryData} 
                        options={doughnutOptions}
                        key={`category-distribution-doughnut-${activeTab}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <motion.div
              variants={chartVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Performance Radar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <Radar 
                      ref={setChartRef('performance-radar-main')}
                      data={performanceData} 
                      options={radarOptions}
                      key={`performance-radar-main-${activeTab}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {performanceData.labels.map((label, index) => (
                <Card key={label}>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">{label}</h3>
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {performanceData.datasets[0].data[index]}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Target: {performanceData.datasets[1].data[index]}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Charts;
